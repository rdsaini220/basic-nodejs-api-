import express from 'express';
import { APP_PORT, DB_URL } from './config';
import routes from './routes';
import { errorHandler } from './middlewares';
import mongoose from 'mongoose';
const app = express();

// database connect
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
db.once('open', () =>{
    console.log('DB connected...');
})
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.listen(APP_PORT, ()=> { 
     console.log(`Listing on a port ${APP_PORT}.`);
 })