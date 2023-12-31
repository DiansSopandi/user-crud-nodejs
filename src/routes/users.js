import { Router } from 'express';
import { register, verify, authenticate, usersList, userDelete } from '../controllers/user';
import validator from '../middlewares/validator-middleware';
import { AuthenticateValidations, RegisterValidations } from '../validators';
import passport from 'passport';
import { userAuth } from '../middlewares/auth-guard';
import { User } from '../models';

const router = Router();

/*
*   @description  to create a new user account  
*   @api    /users
*   @access public
*   @type   POST
*/

router.post('', RegisterValidations, validator, register);

/*
*   @description  to verify a new user account via email
*   @api    /users/verify/:verificationCode
*   @access public <via Email>
*   @type   GET
*/

router.get('/verify/:verificationCode',verify);

/*
*   @description  to authenticate ot login an user and get auth token
*   @api    /users/login
*   @access public 
*   @type   POST
*/

router.post('/login',AuthenticateValidations, validator, authenticate);

/*
*   @description  to get the authenticated an user's profiles
*   @api    /users/authenticate
*   @access private 
*   @type   GET    
*/
router.get('/authenticate', 
            // passport.authenticate("jwt",{ session : false }), 
            userAuth,
            async (req,   res) => {
                // console.log(req);
                // user : JSON.parse(req.user),
                return res.status(200).json({
                    message : 'Hello JWT',
                })
            });

/**
* @description to get All user
* @Api /users
* @Type GET
*/
router.get('', usersList);

/**
* @description to delete specific user
* @Api /users/:id
* @Type DELETE
 */
router.delete('/:id', userDelete);

export default router;