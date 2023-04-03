const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();
 
const genAuthToken = (user) =>{
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({
        _id: user._id, username: user.username, email: user.email,
    },SECRET_KEY);

    return token;
}

module.exports = genAuthToken;