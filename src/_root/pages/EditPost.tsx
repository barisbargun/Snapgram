import PostForm from '@/components/forms/PostForm'
import { Loading } from '@/components/shared';
import { useGetPostById } from '@/lib/react-query/queries';
import { useParams } from 'react-router-dom'

const EditPost = () => {
  const {id} = useParams();

  const {data:post, isSuccess} = useGetPostById(id || '');

  return (

    isSuccess ?

    <div className='flex flex-col items-center w-full max-w-4xl'>

      <div className='flex gap-1 w-full'>
        <img src='/assets/icons/add-post.svg' alt='add-post-icon'/>
        <h3 className='h3-bold'>Update Post</h3>
      </div>

      <PostForm action='Update' post={post || undefined}/>
      
    </div> :
    <Loading/>
  )
}

export default EditPost