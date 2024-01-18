import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupSchema } from "@/lib/validation"
import {Loading} from "@/components/shared";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { toast } from "@/components/ui/use-toast";
import { toastTexts } from "@/constants/toastTexts";


const SignupForm = () => {

  const { mutateAsync: signInAccount, isPending: isLoadingSignin } = useSignInAccount();
  const { mutateAsync: signUpAccount, isPending: isLoadingSignup } = useCreateUserAccount();
  const { checkLogin } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const newUser = await signUpAccount(values);
    if (!newUser) {
      toast(toastTexts.registerFailed);
      return;
    }

    const loginUser = await signInAccount({email:values.email, password:values.password});


    if (loginUser && await checkLogin()) {
      toast(toastTexts.register)
      setTimeout(() => {
        form.reset();
        navigate("/");
      }, 2000);
    } else {
      toast(toastTexts.loginFailed)
    }
  }



  return (

    <Form {...form}>

      <div className="w-11/12 sm:w-9/12 lg:w-420 flex-center flex-col scale-85">

        <img src="/assets/images/logo.svg" alt="logo" />

        <h3 className="h3-bold md:h2-bold pt-2 text-sm">Create a new account</h3>
        <p className="text-light-4 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="no" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="block" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input autoComplete="no" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input autoComplete="no" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input autoComplete="no" type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="shad-button_primary" type="submit">
            {isLoadingSignin || isLoadingSignup ? <><Loading /> Loading </> : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>


  )
}

export default SignupForm