import { Loading } from '@/components/shared';
import GridUser from '@/components/shared/GridUser';
import SearchArea from '@/components/shared/SearchArea'
import { useAuthContext } from '@/context/authContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetInfiniteUsers } from '@/lib/react-query/queries';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

const AllUsers = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchValue, 1500)

  const {user} = useAuthContext();

  const { data: users, isSuccess, fetchNextPage, hasNextPage } = useGetInfiniteUsers(debouncedValue);


  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, debouncedValue]);

  return (

    <main className='w-[90%] flex flex-col items-center'>
      <div className='search-input-container'>
        <h3 className='h3-bold sm:h2-bold'>Search Users</h3>
        <SearchArea searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {!isSuccess ? <Loading /> :

        <>
          <div className='grid-user-container flex flex-wrap gap-9 w-full max-w-5xl mt-5'>
            {

              users?.pages?.map(v1 =>
                v1.documents.map((v2:IUser) => v2.$id !== user.$id && <GridUser key={v2.$id} user={v2} />))

            }
          </div>

          {hasNextPage && <div ref={ref} className='mt-10'> {inView &&  <Loading />}</div>}
        </>
      }
    </main>
  )
}

export default AllUsers