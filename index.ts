//import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
//import * as _ from 'lodash';

//export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
export const handler = async (event) => {
  const max = 999;
  const val = Math.random()*max;
  console.log(`The random value (max ${max}) is: ${val}`);
  const response = {
    statusCode: 200,
    body: `The random value (max ${max}) is: ${val}`,
  };
  return response;
};

// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return response;
// };