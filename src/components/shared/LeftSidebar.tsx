import { leftSideBarLinks } from '@/constants'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';
import { useAuthContext } from '@/context/authContext';
import { useSignOutAccount } from '@/lib/react-query/queries';
import { Loading } from '.';

const LeftSideBar = () => {

  const { user } = useAuthContext();

  const { mutateAsync: signOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess)
      navigate(0);
  }, [isSuccess])

  const { pathname } = useLocation();

  return (
    <nav className='leftsidebar_container'>

      <div className='leftsidebar'>
        <div className='mb-2'>
          <Link to="/">
            <img src="/assets/images/logo.svg" alt='logo' />
          </Link>
        </div>

        <div className='flex items-center gap-2'>
          {
            user.email ?
              <>
                <Link to={`/profile/${user.$id}`}>
                  <img src={user.imageUrl || '/assets/images/logo.svg'} alt='logo' className='w-10 h-10 rounded-full' />
                </Link>
                <div className='flex flex-col items-start'>
                  <h3 className='body-bold'>{user.name}</h3>
                  <p className='text-light-3 small-regular'>@{user.username}</p>
                </div>
              </>
              :
              <div className='w-full flex ml-3 text-light-4 small-regular'>
                <Loading />&nbsp;Loading profile
              </div>
          }
        </div>

        <div className='flex flex-col justify-between mt-2'>

          <div>
            {leftSideBarLinks.map(v => {
              const isActive = pathname === v.root;
              return (
                <Link className='w-full leftsidebar-link group' to={v.root} key={v.name}>
                  {
                    <p className={`leftsidebar-link flex items-center gap-3 px-3 py-2 mb-2 ${isActive && 'bg-primary-500 '}`}>
                      <img src={v.image} alt='icon' className={`w-5 h-5 group-hover:invert-white ${isActive && 'invert-white'}`} />
                      {v.name}
                    </p>
                  }
                </Link>
              )
            })}
          </div>

          <div className='group mt-12'>
            <Button className='gap-3 w-full flex justify-start px-3 leftsidebar-link' variant='ghost' onClick={() => signOut()}>
              <img src="/assets/icons/logout.svg" alt='logout' className='w-5 h-5 group-hover:invert-white' />
              Logout
            </Button>
          </div>


        </div>
      </div>

    </nav>
  )
}

export default LeftSideBar