import { validationResult } from 'express-validator';

const   validationMiddleware = ( req,res,next ) => {
    let errors = validationResult(req);
    
    if (!errors.isEmpty()){
        return res.status(422).json({
            errors : errors.array()
        });
    }
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    next();
}

export default validationMiddleware;