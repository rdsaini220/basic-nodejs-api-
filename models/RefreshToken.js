import { string } from 'joi';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const refreshTokenSchema = new Schema({
    token : {type: String, unique: true}
},{timestamps: true});


export default mongoose.model('RefreshToken', refreshTokenSchema)