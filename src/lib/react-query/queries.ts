import { UseQueryResult, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts,getInfiniteUsers, getPostsById, getRecentPosts, getUserById, likePost, savePost, signInAccount, signOutAccount, unLikePost, updatePost, updateUser } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

// ======================= User 

export const useGetCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getCurrentUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  });
};

export const useGetCurrentUserQuery = () => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn:getCurrentUser
  });
};

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetUserById = (userId:string):UseQueryResult<IUser | null, Error> => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn:() => getUserById(userId)
  });
};

export const useUpdateUser= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (user) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_USERS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, user?.$id]
      })
    }
  });
}

export const useGetInfiniteUsers = (searchTerm:string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_USERS, searchTerm],
    queryFn:({pageParam}) => getInfiniteUsers(pageParam, searchTerm),
    getNextPageParam: (lastPage: Models.Document) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    }})
};

// ======================= Posts

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
      })
    }
  });
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, post?.$id]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
      })
    }
  });
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IDeletePost) => deletePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
      })
    }
  });
}

export const useGetRecentPosts = ():UseQueryResult<{documents:IPost[]} | null, Error> => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
    queryFn:getRecentPosts
  });
};

export const useGetInfinitePosts = ({searchTerm, condition}:IGetInfinitePosts) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS, searchTerm],
    queryFn:({pageParam}) => getInfinitePosts({pageParam, searchTerm, condition}),
    getNextPageParam: (lastPage:Models.Document) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    
  })
};




export const useGetPostById = (postId:string):UseQueryResult<IPost | null, Error> => {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn:() => getPostsById(postId),
    enabled:!!postId
  });
};

// ======================= Likes

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({userId, postId}:{ userId:string, postId: string}) => likePost(userId, postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post?.$id]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.post?.creator?.$id]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  });
}

export const useUnLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unLikeProps:IUnLike) => unLikePost(unLikeProps),
    onSuccess: (unLikeProps) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, unLikeProps?.post.$id]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, unLikeProps?.post.creator.$id]
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  });
}

// ======================= Saves

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({userId, postId}:{userId: string, postId: string}) => savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    }
  });
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedID:string) => deleteSavedPost(savedID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    }
  });
}

