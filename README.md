# api-CRUD
**Simple HTTP API para CRUD sobre una base de datos NO SQL.**

Payload basado en el dataset VMT (https://data.world/associatedpress/vehicle-miles-traveled)

Implementado con 3 componentes AWS:

- AWS API Gateway: HTTP API 
- AWS Lambda: Microservicio implementado como función NodeJs, en modo serverless.
- AWS DynamoDB: Base de datos NOSQL

La infraestructura está declarada como código en un template de SAM (Serverless Application Model): template.yaml

**Definicion de la API en formato OpenAPI 3.0**: api_definition.yaml

**Documentacion de la API**
https://htmlpreview.github.io/?https://github.com/crvillanu/api-CRUD/blob/main/docs/index.htm

**Instalación en AWS, con cliente SAM**

`sam deploy --no-fail-on-empty-changeset --stack-name api-CRUD --template-file template.yaml --capabilities CAPABILITY_IAM --s3-bucket crvillanu-code`

**Testing (Mocha)**

`npm test`

