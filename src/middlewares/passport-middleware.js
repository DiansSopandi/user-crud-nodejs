import passport from 'passport';
import { User } from '../models';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { SECRET as secretOrKey } from '../constants';

const opts = {
    secretOrKey,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
}

passport.use(
    new Strategy(opts, async({ id }, done) => {
        try {
            let user = User.findById(id);
            if (!user) {
                throw new Error('user not fouund');
            }
            
            return done(null,user);
        } catch (error) {
            done(null,false)
        }
    })
);

export default passport;