type typeVariant = 'default' | 'destructive'

interface IToastText {
  title:string;
  description?:string;
  variant?:typeVariant;
}

interface IToastAction {
  delete:IToastText;
  deleteFailed:IToastText;

  login:IToastText;
  loginFailed:IToastText;

  register:IToastText;
  registerFailed:IToastText;

  addPost:IToastText;
  addPostFailed:IToastText;

  editProfile:IToastText;
  editProfileFailed:IToastText;
}

const REDIRECTING_TO_HOME_PAGE = 'You are redirecting to home page.';
const TRY_AGAIN = 'Please try again.';
export const toastTexts:IToastAction = {
  delete:{title:'Deleted success!', description:REDIRECTING_TO_HOME_PAGE},
  deleteFailed:{title:'Deleted Failed.', description:TRY_AGAIN, variant:'destructive'},

  login:{title:'Login success!'},
  loginFailed:{title:'Login failed.', description:TRY_AGAIN, variant:'destructive'},

  register:{title:'Registered successfully!', description:REDIRECTING_TO_HOME_PAGE},
  registerFailed:{title:'Register failed.', description:TRY_AGAIN, variant:'destructive'},

  addPost:{title:'Successfully added!', description:REDIRECTING_TO_HOME_PAGE},
  addPostFailed:{title:'An error happened.', description:TRY_AGAIN, variant:'destructive'},

  editProfile:{title:'Profile changed successfully!', description:REDIRECTING_TO_HOME_PAGE},
  editProfileFailed:{title:'An error happened.', description:TRY_AGAIN, variant:'destructive'}
}