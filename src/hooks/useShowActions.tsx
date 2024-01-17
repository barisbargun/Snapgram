import { useEffect, useState } from 'react'

type props = {
  isHavingId:boolean | undefined;
  isPending:boolean;
} 

const useShowActions = ({isHavingId, isPending}: props) => {

  const [oldValue, setOldValue] = useState<boolean | undefined>(undefined);
  const [showAction, setShowAction] = useState<boolean>(true);

  useEffect(() => {
    if(isPending || oldValue === isHavingId) setShowAction(false);
    else {
      setOldValue(isHavingId);
      setShowAction(true);
    }

  }, [isPending, isHavingId])

  return showAction;
}

export default useShowActions