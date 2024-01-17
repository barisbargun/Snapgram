import React from 'react'
import { Input } from '../ui/input';


type searchAreaProps = {
  searchValue:string;
  setSearchValue:React.Dispatch<React.SetStateAction<string>>;
}

const SearchArea = ({searchValue, setSearchValue}:searchAreaProps) => {
  return (
    <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
      <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
      <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='explore-search w-full'/>
    </div>
  )
}

export default SearchArea