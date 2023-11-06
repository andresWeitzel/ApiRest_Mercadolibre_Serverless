//Externals
const { Op } = require("sequelize");
//Models
const { User } = require("../../models/sequelize/user");
//Enums
const { sequelizeConnection } = require("../../enums/sequelize/errors");
const {
  sortingMessage,
} = require("../../enums/pagination/errors/status-message");
const { statusCode } = require("../../enums/http/status-code");
//Helpers
const { getDateFormat } = require("../../helpers/sequelize/format/date-format");
const {
  checkSequelizeErrors,
} = require("../../helpers/sequelize/errors/checkError");
const {
  checkOrderAt,
  checkOrderBy,
} = require("../../helpers/pagination/users/order");
const { validatePathParameters } = require("../../helpers/http/query-string-params");
// Const
//connection_status
//codes
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
//connection_status
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_REFUSED_STATUS =
  sequelizeConnection.CONNECTION_REFUSED_ERROR;
//sorting messages
const ORDER_BY_ERROR_MESSAGE = sortingMessage.ORDER_BY_ERROR_MESSAGE;
const ORDER_AT_ERROR_MESSAGE = sortingMessage.ORDER_AT_ERROR_MESSAGE;
const GENERIC_ERROR_LOG_MESSAGE =
  "Error in getLikeCountryId service function. Caused by ";
//vars
let userList;
let countryId;
let msg;
let queryStrParams;
let pageSizeNro;
let validatePathParam;
let pageNro;
let orderBy;
let orderAt;
let order;

/**
 * @description get all paged users whose country id matches the passed as parameter
 * @param {Object} event event type
 * @returns a list of paginated users
 * @example
 * [{"id":1,"nickname":"RAFA-CON","first_name":"Rafael","last_name":"Castro","email":"rafael_castro88@gmail.com","identification_type":"DNI","identification_number":"445938822","country_id":"AR","creation_date":"2023-02-12 21:18:11","update_date":"2023-02-12 21:18:11"},{"id".....]
 */
const getLikeCountryId = async function (event) {
  try {
    userList = null;
    countryId = null;
    msg = null;
    //pagination
    pageSizeNro = 5;
    pageNro = 0;
    orderBy = "id";
    orderAt = "ASC";
    msgResponse = null;
    msgLog = null;

    //-- start with path parameters  ---
    countryId = await event.pathParameters.countryId;

    validatePathParam = await validatePathParameters(countryId);

    if (!validatePathParam) {
      return await requestResult(
        BAD_REQUEST_CODE,
        "Bad request, the country id passed as a parameter is not valid"
      );
    }
    //-- end with path parameters  ---
    //-- start with pagination  ---
    queryStrParams = await event.queryStrParams;

    if (queryStrParams != (null && undefined)) {
      pageSizeNro = queryStrParams.limit
        ? parseInt(queryStrParams.limit)
        : pageSizeNro;
      pageNro = queryStrParams.page
        ? parseInt(queryStrParams.page)
        : pageNro;
      orderBy = queryStrParams.orderBy ? queryStrParams.orderBy : orderBy;
      orderAt = queryStrParams.orderAt ? queryStrParams.orderAt : orderAt;
    }

    orderBy = await checkOrderBy(orderBy);

    if (orderBy == (null || undefined)) {
      return await requestResult(BAD_REQUEST_CODE, ORDER_BY_ERROR_MESSAGE);
    }

    orderAt = await checkOrderAt(orderAt);

    if (orderAt == (null || undefined)) {
      return await requestResult(BAD_REQUEST_CODE, ORDER_AT_ERROR_MESSAGE);
    }

    order = [[orderBy, orderAt]];
    //-- end with pagination  ---

    if (User != null) {
      await User.findAll({
        attributes: {
          include: [
            await getDateFormat("creation_date"),
            await getDateFormat("update_date"),
          ],
        },
        where: {
          country_id: {
            [Op.like]: `%${countryId}%`, //containing what is entered, less strictmatch
          },
        },
        limit: pageSizeNro,
        offset: pageNro,
        order: order,
      })
        .then(async (users) => {
          usersList = users;
        })
        .catch(async (error) => {
          msg = GENERIC_ERROR_LOG_MESSAGE + error;
          console.log(msg);

          userList = await checkSequelizeErrors(error, error.name);
        });
    } else {
      userList = await checkSequelizeErrors(null, DB_CONNECTION_REFUSED_STATUS);
    }
  } catch (error) {
    msg = GENERIC_ERROR_LOG_MESSAGE + error;
    console.log(msg);

    userList = await checkSequelizeErrors(error, DB_CONNECTION_ERROR_STATUS);
  }
  return userList;
};

module.exports = {
  getLikeCountryId,
};
