
type typeVariant = 'default' | 'destructive'

interface IToastText {
  title:string;
  description:string;
  variant?:typeVariant;
}

interface IToastAction {
  delete:IToastText;
  deleteFailed:IToastText;
}

const REDIRECTING_TO_HOME_PAGE = 'You are redirecting to home page.';
const TRY_AGAIN = 'Try again.';
export const toastTexts:IToastAction = {
  delete:{title:'Deleted success', description:REDIRECTING_TO_HOME_PAGE},
  deleteFailed:{title:'Deleted Failed', description:TRY_AGAIN, variant:'destructive'}
}