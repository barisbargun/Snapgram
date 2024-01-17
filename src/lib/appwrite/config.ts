import { Account, Avatars, Client, Databases, Storage } from "appwrite"


export const APPWRITE_URL:string = import.meta.env.VITE_APPWRITE_URL;
export const PROJECT_ID:string = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID:string =import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const STORAGE_ID:string =import.meta.env.VITE_APPWRITE_STORAGE_ID;
export const USERS_COLLECTION_ID:string =import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
export const POSTS_COLLECTION_ID:string =import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
export const SAVES_COLLECTION_ID:string =import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID;
export const LIKES_COLLECTION_ID:string =import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID;


export const client = new Client();
client.setProject(PROJECT_ID);
client.setEndpoint(APPWRITE_URL);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);