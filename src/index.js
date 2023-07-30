import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { json } from 'body-parser';

//import Application Constants
import { DB,PORT,DOMAIN } from './constants';

// Router import
import userRoutes from './routes/users';

// initialize express application
const app = express();

app.use(cors());
app.use(json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());

app.get('/',(req,res)=>{res.send('Test Root route')});


app.use('/users',userRoutes);


const main = async () => {
    try {
        await mongoose.connect(DB,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        .then( app.listen(PORT,() => console.log(`Server running on ${DOMAIN}`)) )
        .catch((error) => console.log(`Connection error : ${error.message}`));
    } catch (error) {
        console.log(`Unable to start the server : \n ${error.message}`);
    }
}

main();