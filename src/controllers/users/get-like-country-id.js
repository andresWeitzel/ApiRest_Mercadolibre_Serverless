'use strict';
//Services
const {
  getLikeCountryId
} = require('../../services/users/get-like-country-id');
//Enums
const {
  statusCode
} = require('../../enums/http/statusCode');
const {
  value
} = require("../../enums/general/value");
const {
  statusName
} = require('../../enums/connection/statusName');
//Helpers
const {
  requestResult
} = require('../../helpers/http/bodyResponse');
const {
  validateHeadersParams
} = require('../../helpers/http/requestHeadersParams');
const {
  validateAuthHeaders
} = require('../../helpers/auth/headers');
const {
  validatePathParameters
} = require('../../helpers/http/queryStringParams');

//Const/Vars
let userList;
let countryid;
let eventHeaders;
let validate;
let validateReqParams;
let validatePathParam;
let queryStrParams;
let pageSizeNro;
let pageNro;
let msg;
let code;
let orderAt;
let orderBy;
let order;

/**
 * @description get all paged users whose countryid matches the passed as parameter
 * @param {Object} event Object type
 * @returns a list of paginated users
 */
module.exports.handler = async (event) => {
  try {
    userList = value.IS_NULL;
    countryid = value.IS_NULL;
    pageSizeNro = 5;
    pageNro = 0;
    orderBy = "id";
    orderAt = "ASC";
    msg = value.IS_NULL;
    code = value.IS_NULL;

    //-- start with validation Headers  ---

    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await requestResult(statusCode.BAD_REQUEST, 'Bad request, check missing or malformed headers', event);
    }

    validate = await validateAuthHeaders(eventHeaders);

    if (!validate) {
      return await requestResult(statusCode.UNAUTHORIZED, 'Not authenticated, check x_api_key and Authorization', event);
    }
    //-- end with validation Headers  ---

    //-- start with path parameters  ---
    countryid = await event.pathParameters.countryId;

    validatePathParam = await validatePathParameters(countryid);

    if (!validatePathParam) {
      return await requestResult(
        statusCode.BAD_REQUEST,
        "Bad request, the country id passed as a parameter is not valid"
      );
    }
    //-- end with path parameters  ---

    //-- start with pagination  ---
    queryStrParams = event.queryStringParameters;

    if (queryStrParams != (value.IS_NULL && value.IS_UNDEFINED)) {
      pageSizeNro = event.queryStringParameters.limit
      ? parseInt(await event.queryStringParameters.limit)
      : pageSizeNro;
      pageNro = event.queryStringParameters.page
      ? parseInt(await event.queryStringParameters.page)
      : pageNro;
    orderBy = event.queryStringParameters.orderBy
      ? event.queryStringParameters.orderBy
      : orderBy;
    orderAt = event.queryStringParameters.orderAt
      ? event.queryStringParameters.orderAt
      : orderAt;
    }

    switch (orderBy.toLowerCase()) {
      case "id":
        orderBy = "id";
        break;
      case "nickname":
        orderBy = "nickname";
        break;
      case "first_name":
      case "firstname":
        orderBy = "first_name";
        break;
      case "last_name":
      case "lastname":
        orderBy = "last_name";
        break;
      case "email":
        orderBy = "email";
        break;
      case "identification_type":
      case "identificationtype":
        orderBy = "identification_type";
        break;
      case "identification_number":
      case "identificationnumber":
        orderBy = "identification_number";
        break;
      case "country_id":
      case "countryid":
        orderBy = "country_id";
        break;
      case "creation_date":
      case "creationdate":
        orderBy = "creation_date";
        break;
      case "update_date":
      case "updatedate":
        orderBy = "update_date";
        break;
      default:
        return await requestResult(
          statusCode.BAD_REQUEST,
          "It is not possible to apply sorting based on the requested orderBy value. Invalid field",
          event
        );
    }
    switch (orderAt.toLowerCase()) {
      case "asc":
        orderAt = "ASC";
        break;
      case "desc":
        orderAt = "DESC";
        break;
      default:
        return await requestResult(
          statusCode.BAD_REQUEST,
          "It is not possible to apply sorting based on the requested orderAt value. Invalid field",
          event
        );
    }
    
    order = [[orderBy, orderAt]];
    //-- end with pagination  ---

    //-- start with db query  ---
    userList = await getLikeCountryId(countryid, pageSizeNro, pageNro, order);

    switch (userList) {
      case statusName.CONNECTION_REFUSED:
        return await requestResult(
          statusCode.INTERNAL_SERVER_ERROR,
          "ECONNREFUSED. An error has occurred with the connection or query to the database. Verify that it is active or available"
        );
      case statusName.CONNECTION_ERROR:
        return await requestResult(
          statusCode.INTERNAL_SERVER_ERROR,
          "ERROR. An error has occurred in the process operations and queries with the database Caused by SequelizeConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:3306."
        );
      case value.IS_ZERO_NUMBER || value.IS_UNDEFINED || value.IS_NULL:
        return await requestResult(
          statusCode.BAD_REQUEST,
          "Bad request, could not get paginated list of users according to country id. Try again."
        );
      default:
        return await requestResult(statusCode.OK, userList, event);
    }
    //-- end with db query  ---

  } catch (error) {
    msg = `ERROR in get-like-country-id lambda. Caused by ${error}`;
    code = statusCode.INTERNAL_SERVER_ERROR;
    console.error(msg);

    return await requestResult(code, msg, event);
  }

};