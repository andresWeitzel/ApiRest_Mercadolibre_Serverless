'use strict';
//Services
const { getAll } = require('../../services/users/get-all');
//Enums
const { statusCode } = require('../../enums/http/status-code');
const {
  validateHeadersMessage,
} = require('../../enums/validation/errors/status-message');
const {
  sequelizeConnection,
  sequelizeConnectionDetails,
} = require('../../enums/sequelize/errors');
//Helpers
const { requestResult } = require('../../helpers/http/body-response');
const {
  validateHeadersParams,
} = require('../../helpers/http/request-headers-params');
const { validateAuthHeaders } = require('../../helpers/auth/headers');
//Const
// validate msg
const HEADERS_PARAMS_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_PARAMS_ERROR_MESSAGE;
const HEADERS_AUTH_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_AUTH_ERROR_MESSAGE;
//codes
const INTERNAL_SERVER_ERROR_CODE = statusCode.INTERNAL_SERVER_ERROR;
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
const UNAUTHORIZED_CODE = statusCode.UNAUTHORIZED;
const OK_CODE = statusCode.OK;
//connection_status
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_ERROR_STATUS_DETAILS =
  sequelizeConnectionDetails.CONNECTION_ERROR_DETAIL;
const DB_CONNECTION_REFUSED_STATUS =
  sequelizeConnection.CONNECTION_REFUSED_ERROR;
const DB_CONNECTION_REFUSED_STATUS_DETAILS =
  sequelizeConnectionDetails.CONNECTION_REFUSED_DETAIL;
const DB_INVALID_CONNECTION_ERROR =
  sequelizeConnection.INVALID_CONNECTION_ERROR;
const DB_INVALID_CONNECTION_ERROR_DETAILS =
  sequelizeConnectionDetails.INVALID_CONNECTION_ERROR_DETAIL;
const DB_CONNECTION_TIMEOUT_ERROR =
  sequelizeConnection.CONNECTION_TIMEOUT_ERROR;
const DB_CONNECTION_TIMEOUT_ERROR_DETAILS =
  sequelizeConnectionDetails.CONNECTION_TIMEOUT_ERROR_DETAIL;
//Vars
let userList;
let eventHeaders;
let validateReqParams;
let validateAuth;
let msgResponse;
let msgLog;

/**
 * @description gets all paged users
 * @param {Object} event Object type
 * @returns a list of paginated users
 */
module.exports.handler = async (event) => {
  try {
    //users
    userList = null;
    msgResponse = null;
    msgLog = null;

    //-- start with validation Headers  ---
    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await requestResult(
        BAD_REQUEST_CODE,
        HEADERS_PARAMS_ERROR_MESSAGE,
      );
    }

    validateAuth = await validateAuthHeaders(eventHeaders);

    if (!validateAuth) {
      return await requestResult(UNAUTHORIZED_CODE, HEADERS_AUTH_ERROR_MESSAGE);
    }
    //-- end with validation Headers  ---

    //-- start with db query --
    userList = await getAll(event);

    switch (userList) {
      case DB_CONNECTION_ERROR_STATUS:
        return await requestResult(
          INTERNAL_SERVER_ERROR_CODE,
          DB_CONNECTION_ERROR_STATUS_DETAILS,
        );
      case DB_CONNECTION_REFUSED_STATUS:
        return await requestResult(
          INTERNAL_SERVER_ERROR_CODE,
          DB_CONNECTION_REFUSED_STATUS_DETAILS,
        );
      case DB_INVALID_CONNECTION_ERROR:
        return await requestResult(
          INTERNAL_SERVER_ERROR_CODE,
          DB_INVALID_CONNECTION_ERROR_DETAILS,
        );
      case DB_CONNECTION_TIMEOUT_ERROR:
        return await requestResult(
          INTERNAL_SERVER_ERROR_CODE,
          DB_CONNECTION_TIMEOUT_ERROR_DETAILS,
        );
      case 0:
      case undefined:
      case null:
        return await requestResult(
          BAD_REQUEST_CODE,
          'Bad request, failed to obtain paginated users list.',
        );
      default:
        if (typeof userList === 'object' && userList[0]?.hasOwnProperty('id')) {
          return await requestResult(OK_CODE, userList);
        }
        return await requestResult(BAD_REQUEST_CODE, userList);
    }

    //-- end with db query  ---
  } catch (error) {
    msgResponse = 'ERROR in get-all lambda function.';
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await requestResult(INTERNAL_SERVER_ERROR_CODE, msgResponse);
  }
};
