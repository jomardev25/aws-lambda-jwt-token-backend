const bcrypt = require("bcryptjs");
const { dynamodb, tableName } = require("../config/config");
const util = require("../utils/util");
const HttpStatus = require("../http/httpStatus");
const jwt = require("../utils/jwt");

const login = async (request) => {
    const username = request.username;
    const password = request.password;

    if(!request || !username || !password) {
        return util.buildResponse(HttpStatus.BAD_REQUEST, {
            message: "Username and Password are required."
        });
    }

    const user = await getUser(username);
    if(!user || !user.username) {
        return util.buildResponse(HttpStatus.NOT_FOUND, {
            message: "Invalid username."
        });
    }

    if(!bcrypt.compareSync(password, user.password)) {
        return util.buildResponse(HttpStatus.FORBIDDEN, {
            message: "Password is incorrect."
        }); 
    }

    const userInfo = {
        username: user.username,
        name: user.name
    };

    const token = jwt.generateToken(userInfo);
    const response = {
        user: userInfo,
        token: token
    }

    return util.buildResponse(HttpStatus.OK, response);
};

const getUser = async (username) => {
    const params = {
        TableName: tableName,
        Key: {
            username: username
        }
    };

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error("There is an error: ", error);
    });
};

module.exports.login = login;