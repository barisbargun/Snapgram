import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Loading } from '../shared'
import FileUploader from '../shared/FileUploader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUpdateUser } from '@/lib/react-query/queries'
import { userUpdateSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { toast } from '../ui/use-toast'
import { Textarea } from '../ui/textarea'
import { toastTexts } from '@/constants/toastTexts'

const ProfileForm = ({ user }: { user: IUser }) => {

  const navigate = useNavigate();

  const { mutateAsync: updateUser, isPending: updatePending } = useUpdateUser();

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio:user.bio || "",
      file: []
    },
  })

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {

    const res = await updateUser({ file: values.file, user: { ...user, ...values } });
    if (res) {
      toast(toastTexts.editProfile)
      setTimeout(() => {
        form.reset();
        navigate("/");
      }, 2000);
    } else {
      toast(toastTexts.editProfileFailed);
    }

  }


  return (
    <Form {...form}>
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
              <FormMessage />
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea autoComplete="no" className="shad-textarea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={user?.imageUrl}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4 items-center justify-end'>
          <Button type='button' onClick={() => navigate(-1)} className="shad-button_dark_4">Cancel</Button>
          <Button disabled={updatePending} className='shad-button_primary' type="submit">
            {updatePending ? <Loading /> : `Update User`}</Button>
        </div>

      </form>
    </Form >
  )
}

export default ProfileForm