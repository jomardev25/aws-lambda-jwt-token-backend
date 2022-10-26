const bcrypt = require("bcryptjs");
const { dynamodb, tableName } = require("../config/config");
const util = require("../utils/util");
const HttpStatus = require("../http/httpStatus");

async function register(request) {
    const name = request.name;
    const email = request.email;
    const username = request.username;
    const password = request.password;

    if(!name || !email || !username || !password) {
        return util.buildResponse(HttpStatus.BAD_REQUEST, {
            message: "All fields are required."
        });
    }

    const user = await getUser(username);
    if(user && user.username){
        return util.buildResponse(HttpStatus.BAD_REQUEST, {
            message: "Username already exists. Please choose a different username."
        });
    }

    const encryptedPW = bcrypt.hashSync(password, 10);
    const userInfo = {
        name: name,
        email: email,
        username: username,
        password: encryptedPW
    };

    const saveUserResponse = await saveUser(userInfo);
    if(!saveUserResponse) {
        return util.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
            message: "Server Error. Please try again later."
        });
    }

    return util.buildResponse(HttpStatus.CREATED, {
        name: name,
        email: email,
        username: username
    });
}

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

const saveUser = async (user) => {
    const params = {
        TableName: tableName,
        Item: user
    };

    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error("There is an error: ", error);
    }); 
};

module.exports.register = register;