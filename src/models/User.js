import { Schema,model } from 'mongoose';
import { hash,compare } from 'bcryptjs';
import { sign }         from 'jsonwebtoken';
import { SECRET }       from '../constants';
import { randomBytes }  from 'crypto';
import { pick }         from 'lodash';

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: ''
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: String,
        required: false
    },
    resetPasswordToken:{
        type: String,
        required: false
    },
    resetPasswordExpiresIn:{
        type: Date,
        required: false
    },

},{
    timestamps: true
});

//callbacknya tidak menggunakan arrow function karena tidak menjangkau scope this
UserSchema.pre('save', async function(next){
   let user = this;// this merujuk ke function dan tabel schema
   
   //jika isi field password tidak berubah maka tidak terjadi apa2
   if(!user.isModified('password')) return next();
   user.password = await hash(user.password,10);
   next();
});

UserSchema.methods.comparePassword = async function(password) {
    return await compare(password, this.password);
}

UserSchema.methods.generateJWT = async function(){
    let payload = {
        id: this._id,
        name: this.name,
        email: this.email
    }

    return await sign(payload, SECRET, { expiresIn: '1h'});
}

UserSchema.methods.generatePasswordReset =  function(){
    // this.resetPasswordExpiresIn = Date.now() + 36000000; // oneday
    this.resetPasswordExpiresIn = Date.now() + 36000; // 1 h
    this.resetPasswordToken = randomBytes(20).toString('hex');
}

UserSchema.methods.getUserInfo = function(){
    return pick(this,['_id','name','email','verified']);
}

const User = model('user',UserSchema);
export default User;
