const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    let requestJSON;

    const headers = {
        "Content-Type": "application/json"
    };

    try {
        console.log("iniciando");

        switch (event.routeKey) {
            case "POST /VehicleMilesTraveled":
                console.log("caso POST");
                requestJSON = JSON.parse(event.body);
                
                await dynamo
                    .put({
                        TableName: "tbVehiclesMilesTraveled",
                        Item: requestJSON
                    })
                    .promise();
                body = `Created item ${requestJSON.county_fips}/${requestJSON.date}`;
                break;

            case "GET /VehicleMilesTraveled":
                body = await dynamo
                    .scan({ TableName: "tbVehiclesMilesTraveled" })
                    .promise();
                break;


            case "GET /VehicleMilesTraveled/{county_fips}/{date}":
                console.log("GET item");
                let llave_get = {
                    county_fips: parseInt(event.pathParameters.county_fips),
                    date: event.pathParameters.date
                };

                body = await dynamo
                    .get({
                        TableName: "tbVehiclesMilesTraveled",
                        Key: llave_get
                    })
                    .promise();
                break;

            case "PUT /VehicleMilesTraveled/{county_fips}/{date}":
                requestJSON = JSON.parse(event.body);
                let llave_put = {
                    county_fips: parseInt(event.pathParameters.county_fips),
                    date: event.pathParameters.date
                };
                await dynamo
                    .put({
                        TableName: "tbVehiclesMilesTraveled",
                        Item: requestJSON
                    })
                    .promise();
                body = `Updated item ${requestJSON.county_fips}/${requestJSON.date}`;
                break;

            case "DELETE /VehicleMilesTraveled/{county_fips}/{date}":
                let llave_delete = {
                    county_fips: parseInt(event.pathParameters.county_fips),
                    date: event.pathParameters.date
                };
                await dynamo
                    .delete({
                        TableName: "tbVehiclesMilesTraveled",
                        Key: llave_delete
                    })
                    .promise();
                body = `Deleted item ${event.pathParameters.county_fips}/${event.pathParameters.date}`;
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



