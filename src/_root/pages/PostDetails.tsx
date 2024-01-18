import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '@/context/authContext';
import PostStats from '@/components/shared/PostStats';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queries';
import { useToast } from '@/components/ui/use-toast';
import { toastTexts } from '@/constants/toastTexts';
import { Loading } from '@/components/shared';

const PostDetails = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();

  const { data: post, isSuccess } = useGetPostById(id || '');
  const { mutateAsync: deletePost, isPending:isDeletePending } = useDeletePost();

  const postTags = useMemo(() => '#' + post?.tags?.replace(/,/g, ' #').toLowerCase(), [post?.tags]);

  const handleDeletePost = async () => {
    if (post) {
      const res = await deletePost({ postId: post?.$id, imageID: post?.imageID })
      if (res) {
        toast(toastTexts.delete);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast(toastTexts.deleteFailed);
      }
    }
  }

  return (
    post && user && isSuccess ?
      <article className='bg-dark-2 flex flex-col justify-center gap-3 p-4 rounded-lg lg:w-fit lg:flex-row md:max-w-[85%] w-[95%] max-h-[70vh]'>

        <Link to={`/posts/${post.$id}`} className='overflow-hidden flex-center h-full w-full lg:min-w-[300px] xl:min-w-[420px]'>
          <img src={post.imageUrl || ''} alt='image' className='flex-1 rounded-2xl object-contain w-full h-full' />
        </Link>

        <div className='flex flex-col h-fit lg:w-[45%] lg:min-w-[350px] p-4'>
          <div className='flex-center gap-2'>
            <Link to={`/profile/${post.creator?.$id}`}><img src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile-img' className='w-8 h-8 rounded-full' /></Link>

            <div className='flex-1 '>
              <h3 className='font-bold capitalize line-clamp-1'>{post.creator?.name}</h3>
              <p className='text-light-4 subtle-semibold mt-[-4px] line-clamp-2'>{post && formatDistanceToNow(post.$createdAt)} - {post.location}</p>
            </div>

            {user.$id == post.creator?.$id &&
              <div className='flex-center gap-2'>
                {isDeletePending ? <Loading/> :<Link to={`/update-post/${post.$id}`}><img src='/assets/icons/edit.svg' className='w-5 h-5' /></Link>}
                {isDeletePending ? <Loading/> : <img src='/assets/icons/delete.svg' className='w-5 h-5 cursor-pointer' onClick={handleDeletePost} />}
                
              </div>
            }

          </div>

          <p className='small-medium my-2 w-60'>{post.caption}</p>

          <p className='min-h-5 whitespace-nowrap overflow-hidden text-light-4 subtle-semibold line-clamp-10' title={postTags}> {postTags}</p>

        <br/>
        <PostStats post={post}/>
        </div>
      </article> : <Loading />
  )
}

export default PostDetails