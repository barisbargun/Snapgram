import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signinSchema } from "@/lib/validation"
import {Loading} from "@/components/shared";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import { useSignInAccount } from "@/lib/react-query/queries";

const SigninForm = () => {

  const navigate = useNavigate();

  const {mutateAsync:signInAccount, isPending:loading} = useSignInAccount();
  const { checkLogin } = useAuthContext();
  const { toast } = useToast();


  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    const response = await signInAccount(values);
    if (response && await checkLogin()) {
      toast({ title: "Login success!", description: "You are redirecting to main page." })
      setTimeout(() => {
        form.reset();
        navigate("/");
      }, 2000);
    } else {
      toast({ variant: "destructive", title: "Login failed!", description: "Please try again." })
    }
  }

  return (
    <Form {...form}>
      <div className="w-11/12 sm:w-9/12 lg:w-420 flex-center flex-col scale-85">

        <img src="/assets/images/logo.svg" alt="logo" />

        <h3 className="h3-bold md:h2-bold pt-2 text-sm">Log in to your account</h3>
        <p className="text-light-4 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

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
            {loading ? <><Loading /> Loading </> : "Sign in"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm