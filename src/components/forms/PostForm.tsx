import { postSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loading } from '../shared'
import { Button } from '../ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useNavigate } from 'react-router-dom'
import FileUploader from '../shared/FileUploader'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queries'
import { useAuthContext } from '@/context/authContext'
import { useToast } from '../ui/use-toast'
import { toastTexts } from '@/constants/toastTexts'

type PostFormProps = {
  post?: IPost,
  action: 'Create' | 'Update'
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { mutateAsync: createPost, isPending: createPending } = useCreatePost();
  const { mutateAsync: updatePost, isPending: updatePending } = useUpdatePost();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: post ? post.caption : '',
      location: post ? post.location : '',
      file: [],
      tags: post ? post.tags.replace(/,/g, ', ') : ''
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postSchema>) {
    if (action == 'Create') {
      const response = await createPost({
        caption: values.caption,
        userId: user.$id,
        file: values.file,
        location: values.location,
        tags: values.tags
      });
      if (response) {
        toast(toastTexts.addPost)
        setTimeout(() => {
          form.reset()
          navigate("/");
        }, 2500);
      } else toast(toastTexts.addPostFailed)
      return;
    }

    if(post) {
      const response = await updatePost({
        caption: values.caption,
        postId: post.$id,
        imageID: post.imageID,
        imageUrl:post.imageUrl,
        file: values.file,
        location: values.location,
        tags: values.tags
      })

      if (response) {
        toast({ title: "Successfully updated", description: "You are redirecting to home page" })
        setTimeout(() => {
          form.reset()
          navigate("/");
        }, 2500);
      } else toast({ variant: 'destructive', title: "An error happened", description: "Try again." })
    }
    


  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
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
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input autoComplete="no" type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input autoComplete="no" type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4 items-center justify-end'>
          <Button type='button' onClick={() => navigate(-1)} className="shad-button_dark_4">Cancel</Button>
          <Button disabled={createPending || updatePending} className='shad-button_primary' type="submit">
            {createPending || updatePending ? <Loading /> : `${action} Post`}</Button>
        </div>

      </form>
    </Form >
  )
}

export default PostForm