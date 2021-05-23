import { loginSchema, refreshSchema } from '../../validations';
import { CustomErrorHandler, JwtService } from '../../services';
import { User, RefreshToken } from '../../models';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next){
        // validatin
        const { error } = loginSchema.validate(req.body);

        const {email, password}= req.body;

        if(error){
            return next(error)
        }
        
        try{
            // user data check 
            const user = await User.findOne({email})
            if (!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // password match
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // token
            const access_token = JwtService.sign({ _id: user._id, role: user.role })
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '30d', REFRESH_SECRET)

            await RefreshToken.create({ token: refresh_token })

            res.json({ access_token, refresh_token });

        }catch(err){
            return next(err)
        }

    },

    async logout(req, res, next){
        // validatin
        const { error } = refreshSchema.validate(req.body);

        const { refresh_token } = req.body;
        console.log(req.body);
        if (error) {
            return next(error)
        }

        try{
            await RefreshToken.deleteOne({ token: refresh_token})
        } catch(err){
            return next(new Error('somthing went wrong in the database'))
        }

        res.json({ status: "ok" });
    }
}


export default loginController;