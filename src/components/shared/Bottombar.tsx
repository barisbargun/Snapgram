import { bottomBarLinks } from '@/constants'
import { Link, useLocation } from 'react-router-dom'

const Bottombar = () => {

  const { pathname } = useLocation();

  return (
    <div className='bottom-bar'>
      {bottomBarLinks.map(v => {
        const isActive = pathname === v.root;
        return (
          <Link className={`w-1/4 flex-center overflow-hidden flex-col group-hover:bg-primary-500 gap-1 p-2 rounded-lg ${isActive && 'bg-primary-500 '}`} to={v.root} key={`botto-bar-${v.name}`}>
            <img src={v.image} alt='icon' className={`w-4 h-4 group-hover:invert-white ${isActive && 'invert-white'}`} />
            <p className='tiny-medium text-light-2 whitespace-nowrap text-center'>{v.name}</p>
          </Link>
        )
      })}
    </div>
  )
}

export default Bottombar