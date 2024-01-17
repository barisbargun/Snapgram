import { useMemo } from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '@/context/authContext';


type postCardProps = {
  post: IPost
};

const PostCard = ({ post }: postCardProps) => {

  const { user } = useAuthContext();

  const postTags = useMemo(() => '#'+post.tags.replace(/,/g, ' #').toLowerCase(),[post.tags]);

  return (
    post && user &&
    
    <article className='bg-dark-2 flex flex-col gap-2 p-2 rounded-lg  w-full h-[600px]'>


      <div className='flex-center gap-2'>
        <Link to={`/profile/${post.creator?.$id}`}><img src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile-img' className='w-8 h-8 rounded-full' /></Link>

        <div className='flex-1 overflow-hidden whitespace-nowrap'>
          <h3 className='font-bold capitalize'>{post.creator?.name}</h3>
          <p className='text-light-4 subtle-semibold mt-[-4px]'>{formatDistanceToNow(post.$createdAt)} - {post.location}</p>
        </div>

        {user.$id == post.creator?.$id &&
          <Link to={`/update-post/${post.$id}`}><img src='/assets/icons/edit.svg' className='w-5 h-5' /></Link>
        }

      </div>

      <p className='small-medium my-2'>{post.caption}</p>

      <p className='whitespace-nowrap overflow-hidden text-light-4 subtle-semibold' title={postTags}> {postTags.slice(0,35)}{postTags.length >= 35 && '...'}</p>

      <Link to={`/posts/${post.$id}`} className='flex-1 overflow-hidden flex-center'>
        <img src={post.imageUrl || ''} alt='image' className='rounded-2xl object-contain w-full h-full' />
      </Link>

      <PostStats post={post}/>
    </article>
  )
}

export default PostCard