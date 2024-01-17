import { Models } from 'appwrite';
import { useMemo } from 'react'

type IProps = {
  post:IPost | Models.Document | undefined;
  user:IUser | Models.Document | undefined;
}

const useFindSavedId = ({post, user}: IProps) => {
  return useMemo(() =>post && user?.save?.find((v:any) => v.post?.$id === post.$id)?.$id,[user?.save]);
}

export default useFindSavedId