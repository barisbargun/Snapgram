import * as z from "zod"

// Auth Schemas

export const signupSchema = z.object({
    name: z.string().min(2, { message: "You should enter at least 2 characters" }).max(100),
    username: z.string().min(2, { message: "You should enter at least 2 characters" }).max(50),
    email: z.string().min(2, { message: "You should enter at least 2 characters" }).max(50).email({message: "You should enter valid email"}),
    password: z.string().min(8, { message: "You should enter at least 8 characters" }).max(150),
})

export const signinSchema = z.object({
    email: z.string().min(2, { message: "You should enter at least 2 characters" }).max(50).email({message: "You should enter valid email"}),
    password: z.string().min(8, { message: "You should enter at least 8 characters" }).max(150),
})


// User Update Schema

export const userUpdateSchema = z.object({
    name: z.string().min(2, { message: "You should enter at least 2 characters" }).max(100),
    username: z.string().min(2, { message: "You should enter at least 2 characters" }).max(50),
    bio:z.string(),
    file: z.custom<File[]>()
})


// Post Schema

export const postSchema = z.object({
    caption: z.string().min(5, { message: "You should enter at least 5 characters" }).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(5, { message: "You should enter at least 5 characters" }).max(2200),
    tags: z.string().min(5, { message: "You should enter at least 5 characters" }).max(2200),
})

