import { User } from '../models';
import { randomBytes } from 'crypto';

export const register = async ( req,res ) => {      
    let { name, email, password }   = req.body;

    try {
          let userRecord = await User.findOne({ email: email });

          if (userRecord){
              return res.status(400).json({
                success: false,  
                message: 'email already registered...'
              });
          }

          let user = new User({
              ...req.body,
              verificationCode: randomBytes(20).toString('hex')
          });

          await user.save();
      
            let msg = { 
                name: user.name,
                email: user.email,
                verificationCode: user.verificationCode 
            }            


            // if(!result) throw new BadRequestException('invalid credentials');nestjs
            return res.status(201).json({
                success: true,
                message: `User Email Account ${user.email} Created.`
            });
    } catch (error) {        
        console.log(`error user registration: ${error}`);
        return res.status(500).json({
            success: false,
            message: `error user registration ${error}`
        });
    }

}

export const verify = async ( req,res ) => {
    try {

        let { verificationCode } = req.params;

        let user = await User.findOne({verificationCode});

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized access, invalid verification code"
            });
        }

        user.verified = true;
        user.verificationCode = undefined;

        return await user.save().then((res) => res);


    } catch (error) {
        return error;
    }
}

export const authenticate = async ( req,res ) => {
    try {
        let { email,password } = req.body;
        let user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "username not found"
            });
        }

        if ( !(await user.comparePassword(password)) ){
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        let token = await user.generateJWT();

        return res.status(200).json({
            success: true, 
            user: user.getUserInfo(),
            token: `Bearer ${token}`,
            message: "Congratulation, you are now Logged In"
        });


    } catch (error) {
         console.log(`error user authentication: ${error}`);
        return res.status(500).json({
            success: false,
            message: `An error Occurred ${error}`
        });       
    }
}

export const usersList = async (req, res) => {
  try {
    return await User.find().then((result) =>
      res.status(200).json(result)
    );
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    return await User.findOneAndDelete({ _id: id }).then((result) =>
      res.status(200).json({success: true, message: `userId ${id} deleted`,data: result})
    );
  } catch (error) {
    return res.status(204).json(error);
  }
};