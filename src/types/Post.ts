interface IPost {
  $createdAt: string;
  $id: string;
  caption: string;
  creator: IUser;
  imageID: string;
  imageUrl: string;
  likes?: any[]
  location: string;
  save?: any[];
  tags: string;
}

interface INewPost {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

interface IDeletePost {
  postId: string;
  imageID: string;
  findSavedId: string;
};


interface IUpdatePost {
  postId: string;
  caption: string;
  imageID: string;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

interface ISavePost {
  savedID: string;
  postID: string;
}

interface IGetInfinitePosts {
  pageParam?: number;
  searchTerm?: string;
  condition?: { name: string; value: string; };
}