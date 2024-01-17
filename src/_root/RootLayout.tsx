import { Bottombar, LeftSidebar, Loading, Topbar } from '@/components/shared';
import { useAuthContext } from '@/context/authContext';
import { Navigate, Outlet } from 'react-router-dom';

const RootLayout = () => {
  const { isLogin } = useAuthContext();

  return (
    isLogin === false ? <Navigate to={"/sign-in"} /> : isLogin === undefined ? <div className=' absolute top-2 left-2'><Loading/></div> : isLogin === true &&
      <div className='w-full flex flex-col md:flex-row min-h-screen'>
        <Topbar />
        <LeftSidebar />
        <div className='flex flex-1 p-3 justify-center md:py-9 px-5 pb-6'>
          <Outlet />
        </div>
        <Bottombar/>
      </div>
  )
}

export default RootLayout