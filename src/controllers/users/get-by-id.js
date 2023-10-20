'use strict';
//Services
const { getById, getByIdLimit } = require('../../services/users/get-by-id');
//Enums
const { statusCode } = require('../../enums/http/status-code');
const { statusName } = require('../../enums/connection/status-name');
//Helpers
const { requestResult } = require('../../helpers/http/body-response');
const {
  validateHeadersParams,
} = require('../../helpers/http/request-headers-params');
const { validateAuthHeaders } = require('../../helpers/auth/headers');
const {
  validatePathParameters,
} = require('../../helpers/http/query-string-params');

//Const/Vars
let user;
let userId;
let eventHeaders;
let validateHeaders;
let validateReqParams;
let validatePathParam;
let msgResponse;
let msgLog;
let code;

/**
 * @description gets a user with all its attributes whose id matches the one passed as a parameter
 * @param {Object} event Object type
 * @returns a user according to his id
 */
module.exports.handler = async (event) => {
  try {
    user = null;
    userId = null;
    msgResponse = null;
    msgLog = null;
    code = null;

    //-- start with validation Headers  ---

    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await requestResult(
        statusCode.BAD_REQUEST,
        'Bad request, check missing or malformed headers',
      );
    }

    validateHeaders = await validateAuthHeaders(eventHeaders);

    if (!validateHeaders) {
      return await requestResult(
        statusCode.UNAUTHORIZED,
        'Not authenticated, check x_api_key and Authorization',
      );
    }
    //-- end with validation Headers  ---

    //-- start with path parameters  ---
    userId = await event.pathParameters.id;

    validatePathParam = await validatePathParameters(userId);

    if (!validatePathParam) {
      return await requestResult(
        statusCode.BAD_REQUEST,
        'Bad request, the id passed as a parameter is not valid',
      );
    }
    //-- end with path parameters  ---

    //-- start with db query  ---

    user = await getById(userId);
    //user = await getByIdLimit(userId);

    switch (user) {
      case statusName.CONNECTION_REFUSED:
        return await requestResult(
          statusCode.INTERNAL_SERVER_ERROR,
          'ECONNREFUSED. An error has occurred with the connection or query to the database. Verify that it is active or available',
        );
      case statusName.CONNECTION_ERROR:
        return await requestResult(
          statusCode.INTERNAL_SERVER_ERROR,
          'ERROR. An error has occurred in the process operations and queries with the database Caused by SequelizeConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:3306.',
        );
      case 0:
      case undefined:
      case null:
        return await requestResult(
          statusCode.BAD_REQUEST,
          'Bad request, could not fetch user based on id.',
        );
      default:
        return await requestResult(statusCode.OK, user);
    }
    //-- end with db query  ---
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msgResponse = 'ERROR in get-by-id lambda function.';
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await requestResult(code, msgResponse);
  }
};
