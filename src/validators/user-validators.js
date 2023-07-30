import { check } from 'express-validator';

const name = check('name','name is required').not().isEmpty();
const email = check('email','please provide a valid email addess').isEmail();
const password = check('password','password is required minimum length of 6').isLength({ min: 6 });

export const AuthenticateValidations = [email,password];
export const RegisterValidations = [name,email,password];