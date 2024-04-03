const { z } = require('zod');

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is Required" })
        .trim()
        .email({ message: "Invalid Email address" })
        .min(3, { message: "Email must be Upto 3 Letter" })
        .max(255, { message: "Email must not be more than 255 Letter" }),


    password: z
        .string({ required_error: "Password is Required" })
        .min(7, { message: "Password must be Upto 7 Letter" })
        .max(1024, { message: "Password must not be more than 1024 Letter" }),
})
// create a object Schema

const signupSchema = loginSchema.extend({

    username: z
        .string({ required_error: "Name is Required" })
        .trim()
        .min(3, { message: "Name must be Upto 3 Letter" })
        .max(255, { message: "Name must not be more than 255 Letter" }),



    phone: z
        .string({ required_error: "Phone Number is Required" })
        .trim()
        .min(10, { message: "Phone Number must be 10 Digits" })
        .max(10, { message: "Phone Number must not be more than 10 Digits" }),

})

const passwordschema = z.object({

    password: z
        .string({ required_error: "Password is Required" })
        .min(7, { message: "Password must be Upto 7 Letter" })
        .max(1024, { message: "Password must not be more than 1024 Letter" }),
})


const updateUserSchema = z.object({
    username: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(255, { message: "Name must not exceed 255 characters" })
        .optional(), // Marking as optional since user may not update all fields
    email: z.string()
        .email({ message: "Invalid email address" })
        .min(3, { message: "Email must be at least 3 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" })
        .optional(), // Marking as optional since user may not update all fields
    phone: z.string()
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(10, { message: "Phone number must not exceed 10 Digits" })
        .optional(), // Marking as optional since user may not update all fields
});

const CommentSchema = z.object({
    blogid: z.string().optional(),
    userid: z.string().optional(),
    content: z.string()
        .min(3, { message: "Comment must be at least 3 characters long" })
        .max(255, { message: "Comment must not exceed 255 characters" }),
    createdAt: z.string().optional(), // Assuming createdAt is a string in ISO format
});

const contactSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long').max(50, 'Username must be less than 50 characters'),
    email: z.string().email('Invalid email format'),
    message: z.string().min(3, 'Message must be at least 3 characters long').max(500, 'Message must be less than 500 characters'),
  });

module.exports = { signupSchema, loginSchema, passwordschema, updateUserSchema,CommentSchema ,contactSchema};