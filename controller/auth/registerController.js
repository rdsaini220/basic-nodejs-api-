import { registerSchema } from '../../validations';
import { CustomErrorHandler, JwtService } from '../../services';
import { User, RefreshToken } from '../../models';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';

const registerController = {
    async register(req, res, next){
        // validatin
        const { error } = registerSchema.validate(req.body);

        const {name, email, password}= req.body;
        
        if(error){
            return next(error)
        }

        try{
            const exist = await User.exists({email})
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This email is already taken'));
            }
        }catch(err){
            return next(err)
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        let access_token;
        let refresh_token;
        try{
            // save user data in database 
            const result = await user.save();

            //token
            access_token = JwtService.sign({_id:result._id, role: result.role})
            refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '30d', REFRESH_SECRET)
           
            await RefreshToken.create({ token: refresh_token})

        }catch(err){
            return next(err)
        }

        res.json({ access_token, refresh_token});
    }
}


export default registerController;