//importing npm packages
const express = require('express')
// const connectDB = require('./config/connectDB')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')

//importing router
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')
const convRoute = require('./routes/conversations')
const messagesRoute = require('./routes/messages')

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database Running ${mongoose.connection.host}`);
    } catch (error) {
        console.log('Database Connection Error');
    }
};

//starting app
const app = express();
dotenv.config();
//connecting with db
connectDB();


//Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//Routes
app.use('/api/auth',authRoute)
app.use('/api/post',postRoute)
app.use('/api/user',userRoute)
app.use('/api/conv',convRoute)
app.use('/api/messages',messagesRoute)

//listening the app on port
const PORT = process.env.PORT
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on port:", PORT)
    })
})
// update profile img and cover image