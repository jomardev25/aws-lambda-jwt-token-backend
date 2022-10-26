const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    if(!user) return null;

    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
};

const verifyToken = (username, token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if(error){
            return {
                verified: false,
                message: "Invalid token"
            }
        }

        if(response.username !== username){
            return {
                verified: false,
                message: "Invalid user"
            }
        }

        return {
            verified: true,
            message: "User successfully verified"
        }
    });
};

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;