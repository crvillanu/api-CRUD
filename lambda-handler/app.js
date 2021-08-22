const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        console.log("iniciando");

        switch (event.routeKey) {
            case "POST /VehicleMilesTraveled":
                console.log("caso POST");
                let requestJSON = JSON.parse(event.body);
                await dynamo
                    .put({
                        TableName: "tbVehiclesMilesTraveled",
                        Item: {
                            county_fips: requestJSON.county_fips,
                            date: requestJSON.date
                        }
                    })
                    .promise();
                body = `Created item ${requestJSON.id}`;
                break;

            case "GET /customer":
                body = await dynamo
                    .scan({ TableName: "http-crud-tutorial-items" })
                    .promise();
                break;

            case "DELETE /items/{id}":
                await dynamo
                    .delete({
                        TableName: "http-crud-tutorial-items",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                body = `Deleted item ${event.pathParameters.id}`;
                break;

            case "GET /customer/{id}":
                body = await dynamo
                    .get({
                        TableName: "http-crud-tutorial-items",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                break;


            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    }
    catch (err) {
        statusCode = 400;
        body = err.message;
        console.log("se captura excepcion");
        console.log(JSON.stringify(err));
    }
    finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};


