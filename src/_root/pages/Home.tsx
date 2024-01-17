import { Loading } from '@/components/shared';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queries'

const Home = () => {

  const { data: posts, isLoading, isError } = useGetRecentPosts();
  return (
    <main className='w-full sm:px-4 px-1 max-w-[600px]'>
      <h2 className='h2-bold mb-3'>Home Feed</h2>

      <div className='flex flex-col gap-8 '>
        {
          isError || isLoading || !posts ? <Loading /> :
            posts.documents.map((v) => (
              <PostCard post={v} key={v.$id} />
            ))
        }
      </div>
    </main>
  )
}

export default Home