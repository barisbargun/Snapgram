import { Loading } from '@/components/shared';
import GridPost from '@/components/shared/GridPost';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/authContext'
import { useGetUserById } from '@/lib/react-query/queries';
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { Link, useParams } from 'react-router-dom';

const Profile = () => {

  const [postCount, setPostCount] = useState<number>(8);
  const [showCreatedPosts, setShowCreatedPosts] = useState<boolean>(true);
  const { id } = useParams();
  const { ref, inView } = useInView();

  const { user: loggedUser } = useAuthContext();

  const { data: user, isSuccess } = useGetUserById(id || "");

  useEffect(() => {
    if (inView) {
      setPostCount(v => v + 8);
    }
  }, [inView]);

  useEffect(() => {
    setPostCount(8);
  }, [showCreatedPosts])


  const sortedCreatedPosts = useMemo(() => user?.posts?.slice().sort(v => Date.parse(v.$createdAt)).reverse()
    .map(v => { return { ...v, creator: { $id: id || ""} } }), [user?.posts])
  const sortedLikedPosts = useMemo(() => user?.likes?.slice().sort(v => Date.parse(v.$createdAt)).reverse(), [user?.likes])

  return (
    !user ? <Loading /> :
      <section className='w-full flex justify-center'>
        <div className='w-[95%] sm:w-[80%] max-w-[1200px] flex flex-col align-middle'>
          <div className='flex gap-6 flex-col flex-center lg:flex-row'>
            <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile-img' className='profile-photo-img' />
            <div className='flex flex-col w-full'>
              <div className='w-full flex justify-between flex-wrap'>
                <h2 className='sm:h2-bold h3-bold capitalize max-w-[60%] break-all'>{user.name}</h2>
                <div className='flex gap-20'>
                  {
                    user.$id === loggedUser.$id &&
                    <Link to={`/update-profile/${user.$id}`} className='w-fit h-fit'><Button className='shad-button_dark_4 small-medium text-light-2 text-bold'><img src='/assets/icons/edit.svg' className='w-4 h-4 ' /> <p className='md:hidden lg:block '>Edit Profile</p></Button></Link>
                  }

                </div>
              </div>
              <p className='text-light-4 small-regular mt-[-5px] mb-2'>@{user.username}</p>

              <div className='flex line-clamp-1 gap-2 mt-2'>
                <p className='small-regular text-light-2'> <span className='text-primary-500'>{user.posts?.length}</span> Posts</p>
                <p className='small-regular text-light-2'> <span className='text-primary-500'>20</span> Followers</p>
                <p className='small-regular text-light-2'> <span className='text-primary-500'>13</span> Following</p>
              </div>

            </div>

          </div>
          <div className='flex gap-2 mt-10'>
            <Button onClick={() => { setShowCreatedPosts(true) }} className='shad-button_dark_4 small-regular text-light-2'><img src='/assets/icons/posts.svg' alt='post-icon' /> Posts</Button>
            <Button onClick={() => { setShowCreatedPosts(false) }} className='shad-button_dark_4 small-regular text-light-2'><img src='/assets/icons/like.svg' alt='liked-icon' /> Liked Posts</Button>
          </div>

          <div className='grid-container flex flex-wrap gap-9 w-full max-w-5xl mt-5'>
            {
              showCreatedPosts ? isSuccess ?
                sortedCreatedPosts?.slice(0, postCount).map(v => <GridPost key={v.$id} post={v} showStats={true} />) : <Loading /> :
                user ?
                  sortedLikedPosts?.map(v =>
                    <GridPost key={v.$id} post={v.post} showStats={false} showUser={false} />) : <Loading />
            }
          </div>

          {
            (
              (showCreatedPosts && postCount < (user?.posts?.length || 0)) ||
              (!showCreatedPosts && postCount < (user?.likes?.length || 0))
            )

            && <div ref={ref} className='mt-10'> {inView && <Loading />}</div>}

        </div>


      </section>
  )
}

export default Profile