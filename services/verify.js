const util = require("../utils/util");
const jwt = require("../utils/jwt");
const HttpStatus = require("../http/httpStatus");

const verify = (request) => {
    if(!request || !request.user.username || !request.token) {
        return util.buildResponse(HttpStatus.BAD_REQUEST, {
            message: "Invalid request."
        });
    }

    const user = request.user;
    const token = request.token;
    const verification = jwt.verifyToken(user.username, token);
    
    if(!verification.verified) {
        return util.buildResponse(HttpStatus.UNAUTHORIZED, verification);
    }

    return util.buildResponse(HttpStatus.OK, {
        verified: true,
        message: "User successfully verified.",
        user: user,
        token: token
    });

};

module.exports.verify = verify;