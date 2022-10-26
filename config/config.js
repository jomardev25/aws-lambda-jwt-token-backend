const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2"
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "users";

module.exports = {
    dynamodb: dynamodb, 
    tableName : tableName
}