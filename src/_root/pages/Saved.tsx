import { Loading } from '@/components/shared';
import PostCard from '@/components/shared/PostCard';
import { useAuthContext } from '@/context/authContext';
import { useGetRecentPosts } from '@/lib/react-query/queries'

const Saved = () => {
  const { user } = useAuthContext();
  const { data: posts, isLoading, isError } = useGetRecentPosts();

  const savedPostIDs:string[] | undefined = user.save?.map(v => v?.post?.$id);

  return (
    <main className='w-full sm:px-4 px-1 max-w-[600px]'>
      <h2 className='h2-bold mb-3'>Saved Feed</h2>

      <div className='flex flex-col gap-5 flex-center'>
        {
          isError || isLoading || !posts ? <Loading /> : savedPostIDs?.length ? 
          posts.documents.map((v) => savedPostIDs.includes(v.$id) && (
              <PostCard post={v} key={v.$id} />
            )) :
            <h1 className='h3-bold mt-10'> No Saved Posts</h1>
        }
      </div>
    </main>
  )
}

export default Saved