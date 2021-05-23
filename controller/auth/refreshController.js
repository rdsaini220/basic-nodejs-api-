import { refreshSchema } from '../../validations';
import { RefreshToken, User } from '../../models';
import { CustomErrorHandler, JwtService } from '../../services';
import { REFRESH_SECRET } from '../../config';

const refreshController = {
    async refresh(req, res, next){
        // validatin
        const { error } = refreshSchema.validate(req.body);

        const { refresh_token } = req.body;

        if (error) {
            return next(error)
        }

        let refreshtoken;
        try{
            refreshtoken = await RefreshToken.findOne({ token: refresh_token })
            if (!refreshtoken) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }
            let userId;
            try{
                const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;
            }catch {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const user = await User.findOne({ _id: userId })
            if (!user) {
                return next(CustomErrorHandler.unAuthorized('No User Found'));
            }

            //token
            const access_token = JwtService.sign({ _id: user._id, role: user.role })
            const ref_token = JwtService.sign({ _id: user._id, role: user.role }, '30d', REFRESH_SECRET)

            await RefreshToken.create({ token: ref_token })

            res.json({ access_token, refresh_token: ref_token });

        }catch(err){
            return next(new Error('something went wrong ' + err.message));
        }

    }
}


export default refreshController;