import { ID, Models, Query } from "appwrite";
import { DATABASE_ID, LIKES_COLLECTION_ID, POSTS_COLLECTION_ID, SAVES_COLLECTION_ID, STORAGE_ID, USERS_COLLECTION_ID, account, avatars, databases, storage } from "./config";

// ======================= User 

export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);
		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl,
		});
		return newUser;
	} catch (error) {
		console.log(error);
		return null;
	}

}

export async function saveUserToDB(user: {
	accountId: string;
	email: string;
	name: string;
	imageUrl: URL;
	username?: string;
}) {
	try {
		const newUser = await databases.createDocument(
			DATABASE_ID,
			USERS_COLLECTION_ID,
			ID.unique(),
			user
		);

		return newUser;
	} catch (error) {
		console.log(error);
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await account.createEmailSession(user.email, user.password);

		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function getAccount() {
	try {
		const currentAccount = await account.get();

		return currentAccount;
	} catch (error) {
		console.log(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await getAccount();
		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			DATABASE_ID,
			USERS_COLLECTION_ID,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;
		return currentUser;

	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function signOutAccount() {
	try {
		const session = await account.deleteSession("current");
		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function getInfiniteUsers(pageParam: number, searchTerm:string) {
	const queries: any[] = [
		Query.orderDesc("$createdAt"), 
		Query.limit(8),
	];

	if(searchTerm?.length) {
		queries.push(Query.startsWith('name', searchTerm));
	}

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}

	queries.push(Query.select(["$id", "imageUrl", "name", "username", "bio"]));

	try {
		const res = databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, queries);
		if (!res) throw Error;
		return res;

	} catch (error) {
		console.log(error);
		return null;
	}

}

export async function getUserById(userId: string) {
	try {
		const response = databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);

		if (!response) throw Error;
		return response;

	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateUser(user: IUpdateUser): Promise<IUser | Models.Document | null> {
	try {
		let uploadResponse;
		let fileUrl;

		if (user.file?.length) {
			const deleteResponse = user.user.imageId && await deleteFile(user.user.imageId || "");
			if(!user.user.imageId || deleteResponse) {
				uploadResponse = await uploadFile(user.file[0]);
				if (!uploadResponse) throw Error;
	
				fileUrl = filePreview(uploadResponse.$id);
	
				if (!fileUrl) {
					await deleteFile(uploadResponse.$id);
					throw Error;
				}
			}
		}

		const updateName =user.user.name && await account.updateName(user.user.name);
		if (!updateName) throw Error;

		const _user = user.user;
		const response = databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, _user.$id, {
			name: _user.name,
			username: _user.username,
			email: _user.email,
			bio: _user.bio || null,
			imageUrl: fileUrl || user.user.imageUrl || null,
			imageId: uploadResponse?.$id || user.user.imageId || null
		});

		if (!response) throw Error;
		return response;

	} catch (error) {
		console.log(error);
		return null
	}
}

// ======================= Posts

export async function createPost(post: INewPost) {
	try {
		const uploadResponse = await uploadFile(post.file[0]);
		if (!uploadResponse) throw Error;

		const fileUrl = filePreview(uploadResponse.$id);

		if (!fileUrl) {
			await deleteFile(uploadResponse.$id);
			throw Error;
		}

		const tags = post.tags?.replace(/ /g, '') || '';

		const newPost = await databases.createDocument(DATABASE_ID, POSTS_COLLECTION_ID, ID.unique(), {
			creator: post.userId,
			caption: post.caption,
			imageUrl: fileUrl,
			imageID: uploadResponse.$id,
			location: post.location,
			tags: tags
		});

		if (!newPost) {
			await deleteFile(uploadResponse.$id);
			throw Error;
		};

		return newPost;


	} catch (error) {
		console.log(error)
		return null;
	}

}

export async function updatePost(post: IUpdatePost) {
	try {
		let fileUrl;
		let uploadResponseId;

		if (post.file.length) {

			const deleteResponse = await deleteFile(post.imageID);
			if (!deleteResponse) throw Error;

			const uploadResponse = await uploadFile(post.file[0]);
			if (!uploadResponse) throw Error;

			fileUrl = filePreview(uploadResponse.$id);

			if (!fileUrl) {
				await deleteFile(uploadResponse.$id);
				throw Error;
			}
			uploadResponseId = uploadResponse.$id;

		}


		const tags = post.tags?.replace(/ /g, '') || '';

		const updatePost = await databases.updateDocument(DATABASE_ID, POSTS_COLLECTION_ID, post.postId, {
			caption: post.caption,
			imageUrl: fileUrl || post.imageUrl,
			imageID: uploadResponseId || post.imageID,
			location: post.location,
			tags: tags
		});
		if (!updatePost && uploadResponseId) {
			await deleteFile(uploadResponseId);
			throw Error;
		};

		return updatePost;


	} catch (error) {
		console.log(error)
		return null;
	}

}

export async function deletePost(post: IDeletePost) {
	try {
		
		await databases.updateDocument(DATABASE_ID, POSTS_COLLECTION_ID, post?.postId, {likes:[], save:[]})

		await new Promise(resolve => setTimeout(resolve, 1500));

		const deletePost = await databases.deleteDocument(DATABASE_ID, POSTS_COLLECTION_ID, post?.postId);
		if (!deletePost) throw Error;

		await deleteFile(post?.imageID);
		return post;

	} catch (error) {
		console.log(error)
		return null;
	}

}

export async function getRecentPosts() {
	try {
		const posts = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [Query.orderDesc('$createdAt'), Query.limit(20)]);

		if (!posts) throw Error
		return posts;
	} catch (error) {
		console.log(error)
		return null;
	}

}

export async function getInfinitePosts({ pageParam, searchTerm, condition }:IGetInfinitePosts):Promise<Models.DocumentList<Models.Document> | null> {
	const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(8)];

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}

	if(searchTerm?.length) {
		queries.push(Query.search('caption', searchTerm));
	}

	if(condition && condition.name && condition.value) {
		queries.push(Query.equal(condition?.name, condition?.value));
	}

	try {
		const res = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, queries);
		if (!res) throw Error;
		return res;

	} catch (error) {
		console.log(error);
		return null;
	}

}




export async function getPostsById(postId: string) {
	try {
		const posts = await databases.getDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId);

		if (!posts) throw Error
		return posts;
	} catch (error) {
		console.log(error)
		return null;
	}

}


// ============================== LIKE / UNLIKE POST

export async function likePost(userId:string, postId:string) {
	try {
		const likedPost = await databases.createDocument(DATABASE_ID,
			LIKES_COLLECTION_ID, ID.unique(), {user:userId, post:postId})

		if (!likedPost) throw Error;
		return likedPost;

	} catch (error) {
		console.log(error);
		return null;
	}

}

export async function unLikePost(unLikeProps:IUnLike) {
	try {
		const likedPost = await databases.deleteDocument(DATABASE_ID,
			LIKES_COLLECTION_ID, unLikeProps.likeId)

		if (!likedPost) throw Error;
		return unLikeProps;

	} catch (error) {
		console.log(error);
		return null;
	}

}


// ============================== SAVE POST

export async function savePost(userId: string, postId: string) {
	try {
		const post = await databases.createDocument(DATABASE_ID,
			SAVES_COLLECTION_ID, ID.unique(), {
			user: userId,
			post: postId
		});

		if (!post) throw Error;
		return post;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteSavedPost(savedID: string) {
	try {
		const res = await databases.deleteDocument(DATABASE_ID,
			SAVES_COLLECTION_ID, savedID);

		if (!res) throw Error;
		return savedID;
	} catch (error) {
		console.log(error);
	}

}

// ======================= File Storage

export async function uploadFile(file: File) {
	try {
		const response = await storage.createFile(
			STORAGE_ID,
			ID.unique(),
			file
		);
		if (!response) throw Error;
		return response;
	} catch (error) {
		console.log(error)
	}
}

export function filePreview(fileId: string) {
	try {

		const response = storage.getFilePreview(STORAGE_ID, fileId, undefined, undefined, 'center', 100);
		if (!response) throw Error;
		return response;

	} catch (error) {
		console.log(error);
	}
}

export async function deleteFile(fileID: string): Promise<{ status: string } | null> {
	try {
		const response = await storage.deleteFile
			(STORAGE_ID, fileID)
		if (!response) throw Error;
		return { status: 'ok' };
	} catch (error) {
		console.log(error)
		return null;
	}
}