const Joi = require('joi');
const AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});

const dynamo = new AWS.DynamoDB.DocumentClient();

const schema = Joi.object({
    "county_fips": Joi.number().required(),
      "county_name": Joi.string().required(),
      "state_name": Joi.string().required(),
      "date": Joi.string().required(),
      "county_vmt": Joi.number().required(),
      "baseline_jan_vmt": Joi.number().required(),
      "percent_change_from_jan": Joi.number().required(),
      "mean7_county_vmt": Joi.number().required(),
      "mean7_percent_change_from_jan": Joi.number().required(),
      "date_at_low": Joi.string().required(),
      "mean7_county_vmt_at_low": Joi.number().required(),
      "percent_change_from_low": Joi.number().required()
});

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    let requestJSON;

    const headers = {
        "Content-Type": "application/json"
    };

    try {


        switch (event.routeKey) {
            case "POST /VehicleMilesTraveled":

                requestJSON = JSON.parse(event.body);

                try{
                    const value = await schema.validateAsync(requestJSON);

                    await dynamo
                        .put({
                            TableName: "tbVehiclesMilesTraveled",
                            Item: requestJSON,
                            ConditionExpression: "county_fips <> :county_fips AND #date <>  :date",
                            ExpressionAttributeNames: { 
                                "#date" : "date" 
                            },
                            ExpressionAttributeValues: {
                                ":county_fips" : requestJSON.county_fips,
                                ":date": requestJSON.date
                            }
                        })
                        .promise();
                        statusCode = 201;
                        body = `Created item ${requestJSON.county_fips}/${requestJSON.date}`;
                    }
                    catch(ex){
                        if (ex.code == "ConditionalCheckFailedException"){
                            statusCode = 409;
                            body = `Already exists item ${requestJSON.county_fips}/${requestJSON.date}`;
                        }
                        else if (ex.details){
                            statusCode = 400;
                            body = ex.details;
                        }
                        else{
                            throw ex;
                        }
                    }

                break;

            case "GET /VehicleMilesTraveled":
                body = await dynamo
                    .scan({ TableName: "tbVehiclesMilesTraveled" })
                    .promise();
                break;


            case "GET /VehicleMilesTraveled/{county_fips}/{date}":
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



