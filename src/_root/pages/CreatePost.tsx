import PostForm from '@/components/forms/PostForm'

const CreatePost = () => {
  return (
    <div className='flex flex-col items-center w-full max-w-4xl'>

      <div className='flex gap-1 w-full'>
        <img src='/assets/icons/add-post.svg' alt='add-post-icon'/>
        <h3 className='h3-bold'>Create Post</h3>
      </div>

      <PostForm action='Create'/>
      
    </div>
  )
}

export default CreatePost