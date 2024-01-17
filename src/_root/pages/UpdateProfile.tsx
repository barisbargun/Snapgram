import { Loading } from "@/components/shared";
import { useAuthContext } from "@/context/authContext";
import ProfileForm from "@/components/forms/ProfileForm";

const UpdateProfile = () => {

  const { user } = useAuthContext();


  return (
    
    user ?
    <div className='flex flex-col items-center w-full max-w-3xl'>

      <div className='flex gap-1 w-full'>
        <img src='/assets/icons/edit.svg' alt='edit-icon'/>
        <h3 className='h3-bold'>Edit Profile</h3>
      </div>

      <ProfileForm  user={user}/>
      
    </div> :
    <Loading/>
  )
}

export default UpdateProfile