import { Link } from 'react-router-dom';

type gridUserType = {
  user:IUser;
}

const GridUser = ({user}:gridUserType) => {

  return (
    <div className="relative lg:w-[100%] h-60" title={user.bio?.slice(0,80)}>
      <Link to={`/profile/${user.$id}`} className="grid-post_link">
            <img
              src={user.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user mt-5">

              <div className="flex items-center justify-start gap-2 flex-1">
                
                <p className="line-clamp-1">{user.name}</p>
              </div>

          </div>
    </div>
  )
}

export default GridUser;