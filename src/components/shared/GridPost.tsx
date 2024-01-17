import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type gridPostType = {
  post:IPost;
  showUser?:boolean;
  showStats?:boolean;
}

const GridPost = ({post, showUser, showStats}:gridPostType) => {

  return (
    post &&
    <div className="relative lg:w-[100%] h-80" title={post.caption?.slice(0,120)}>
      <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <div className='w-full'> <PostStats post={post}/> </div>}
          </div>
    </div>
  )
}

export default GridPost