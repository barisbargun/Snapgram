import { Loading } from '@/components/shared'
import { useAuthContext } from '@/context/authContext'
import { Outlet } from 'react-router'
import { Navigate } from 'react-router-dom'

const AuthLayout = () => {

  const { isLogin } = useAuthContext();

  return (

    isLogin === true ? <Navigate to={"/"}/> : isLogin === undefined ? <Loading/> : isLogin === false &&
      <>
        < section className='flex flex-1 justify-center items-center flex-col' >
          <Outlet />
        </section >

        <img src='/assets/images/side-img.svg' className='side-img' />
      </>

  )
}

export default AuthLayout