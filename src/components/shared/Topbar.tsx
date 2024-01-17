import { useAuthContext } from '@/context/authContext'
import { useSignOutAccount } from '@/lib/react-query/queries';
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';

const Topbar = () => {

  const {user} = useAuthContext();
  const {mutateAsync:signOut, isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if(isSuccess)
      navigate(0);
  },[isSuccess])

  return (
    <section className='topbar flex w-full justify-between px-4 py-3'>

      <div>
        <Link to="/">
          <img src="/assets/images/logo.svg" alt='logo' />
        </Link>
      </div>

      <div className='flex items-center gap-4'>
        <Link to={`/profile/${user.$id}`}>
          <img src={user.imageUrl || '/assets/images/logo.svg'} alt='logo' className='w-7 h-7 rounded-full' />
        </Link>
        <Button onClick={() => signOut()} className='p-0 m-0'>
          <img src="/assets/icons/logout.svg" alt='logout' className='w-7 h-7 rounded-full' />
        </Button>
      </div>

    </section>
  )
}

export default Topbar