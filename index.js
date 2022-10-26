const registerService = require("./services/register");
const loginService = require("./services/login");
const verifyService = require("./services/verify");
const util = require("./utils/util");

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";

exports.handler = async(event) => {
    console.log("Request Event: ", event);
    const httpMethod = event.httpMethod;
    const path = event.path;
    const requestBody = JSON.parse(event.body);
    let response;
    switch (true) {
        case httpMethod == "GET" && path == healthPath:
            response = util.buildResponse(200);
            break;
        case httpMethod == "POST" && path == registerPath:
            response = await registerService.register(requestBody);
            break;
        case httpMethod == "POST" && path == loginPath:
            response = await loginService.login(requestBody);
            break;
        case httpMethod == "POST" && path == verifyPath:
            response = verifyService.verify(requestBody);
            break;
        default:
            response = util.buildResponse(404, "404 Not Found");
            break;
    }
    return response;
};

