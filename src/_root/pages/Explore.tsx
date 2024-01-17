import { Loading } from '@/components/shared';
import GridPost from '@/components/shared/GridPost';
import SearchArea from '@/components/shared/SearchArea'
import { useDebounce } from '@/hooks/useDebounce';
import { useGetInfinitePosts } from '@/lib/react-query/queries';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchValue, 1500)

  const { data: posts, isSuccess, fetchNextPage, hasNextPage } = useGetInfinitePosts({searchTerm:debouncedValue});


  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, debouncedValue]);

  return (

    <main className='w-[90%] flex flex-col items-center'>
      <div className='search-input-container'>
        <h3 className='h3-bold sm:h2-bold'>Search Posts</h3>
        <SearchArea searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {!isSuccess ? <Loading /> :

        <>
          <div className='grid-container flex flex-wrap gap-9 w-full max-w-5xl mt-5'>
            {

              posts?.pages?.map(v1 =>
                v1.documents.map((v2: IPost) => <GridPost key={v2.$id} post={v2} showStats={true}/>))

            }
          </div>

          {hasNextPage && <div ref={ref} className='mt-10'> {inView &&  <Loading />}</div>}
        </>
      }
    </main>
  )
}

export default Explore