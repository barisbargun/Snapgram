interface IUser {
  $id: string;
  name?: string;
  username?: string;
  password?:string;
  email?: string;
  imageUrl?: string;
  imageId?:string;
  bio?: string;
  likes?:any[];
  save?:any[];
  posts?:IPost[];
}

interface INewUser {
  name:string;
  username:string;
  email:string;
  password:string;
}

interface IUpdateUser {
  user:IUser
  file: File[];
}
