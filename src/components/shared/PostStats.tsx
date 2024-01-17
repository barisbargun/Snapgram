import { useMemo } from 'react'
import { useDeleteSavedPost, useLikePost, useSavePost, useUnLikePost } from '@/lib/react-query/queries'
import { Loading } from '.'
import { useAuthContext } from '@/context/authContext'
import useShowActions from '@/hooks/useShowActions'
import useFindSavedId from '@/hooks/useFindSavedId'


type postStatsType = {
  post: IPost;
}

const PostStats = ({ post }: postStatsType) => {
  const { user } = useAuthContext();

  const userLikedId: string = useMemo(() => post && user?.likes?.find(v => v.post?.$id == post.$id)?.$id, [user?.likes]);
  const findSavedId: string = useFindSavedId({post:post || undefined, user:user});

  const { mutateAsync: likePost, isPending: isPendingLike } = useLikePost();
  const { mutateAsync: unLikePost, isPending: isPendingUnLike } = useUnLikePost();

  const { mutateAsync: savePost, isPending: isPendingSave, } = useSavePost();
  const { mutateAsync: deleteSavedPost, isPending: isPendingDeleteSaved } = useDeleteSavedPost();

  const handleLikePost = async () => {
  
    if (!userLikedId) {
      await likePost({ postId: post.$id, userId:user.$id });
    } else {
      await unLikePost({post, userId:user.$id, likeId:userLikedId})
    }
    
  }

  const handleSavePost = async () => {
    if (findSavedId) {
      await deleteSavedPost(findSavedId);
    } else {
      await savePost({ userId: user.$id, postId: post.$id });
    }

  }

  const likeShow = useShowActions({isHavingId:!!userLikedId, isPending:isPendingLike || isPendingUnLike});
  const saveShow = useShowActions({isHavingId:!!findSavedId, isPending:isPendingSave || isPendingDeleteSaved});

  return (
    post.likes &&
    < div className='flex justify-between' >
      <div className='flex-center'>
        {
          !likeShow ? <><Loading />&nbsp;</> :
            <img src={userLikedId ?
              '/assets/icons/liked.svg' :
              '/assets/icons/like.svg'
            } alt='like' className='mr-1 cursor-pointer' onClick={handleLikePost} />

        }
        <p>{post.likes?.length}</p>
      </div>
      {
        !saveShow ? <><Loading /></> :
          <img src={
            findSavedId ?
              '/assets/icons/saved.svg' :
              '/assets/icons/save.svg'} className='cursor-pointer' alt='save' onClick={handleSavePost} />
      }
    </div >

  )
}

export default PostStats