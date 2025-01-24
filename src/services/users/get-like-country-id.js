//Models
const { User } = require("../../models/sequelize/user");
//Enums
const { sequelizeConnection } = require("../../enums/sequelize/errors");
const {
  sortingMessage,
} = require("../../enums/pagination/errors/status-message");
const { validateUser } = require("../../enums/validation/user/validations");
const { fields } = require("../../enums/common/users");
const { orderAt } = require("../../enums/pagination/ordering/orderAt");

//Helpers
const { getDateFormat } = require("../../helpers/sequelize/format/date-format");
const {
  checkSequelizeErrors,
} = require("../../helpers/sequelize/errors/checkError");
const {
  checkOrderAt,
  checkOrderBy,
} = require("../../helpers/pagination/users/order");
const {
  validatePathParameters,
} = require("../../helpers/http/query-string-params");
const {
  getLowerFormat,
} = require("../../helpers/sequelize/format/lower-format");
// Const
//connection_status
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_REFUSED_STATUS =
  sequelizeConnection.CONNECTION_REFUSED_ERROR;
//sorting messages
const ORDER_BY_ERROR_MESSAGE = sortingMessage.ORDER_BY_ERROR_MESSAGE;
const ORDER_AT_ERROR_MESSAGE = sortingMessage.ORDER_AT_ERROR_MESSAGE;
const GENERIC_ERROR_LOG_MESSAGE = "Error in getLikeCountryId service function.";
//Validations
const VALIDATE_PATH_PARAMETER_USER = validateUser.VALIDATE_PATH_PARAMETER_USER;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_ORDER_BY = fields.ID_NAME_VALUE;
const DEFAULT_ORDER_AT = orderAt.ASC;
//vars
let userList;
let countryId;
let validatePathParam;

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

    //-- start with path parameters  ---
    countryId = await event.pathParameters.countryId;

    validatePathParam = await validatePathParameters(countryId);

    if (!validatePathParam) {
      return VALIDATE_PATH_PARAMETER_USER;
    }

    const queryStrParams = event.queryStringParameters || {};

    // Pagination parameters
    const pageSizeNro = parseInt(queryStrParams.limit) || DEFAULT_PAGE_SIZE;
    const pageNro = parseInt(queryStrParams.page) || DEFAULT_PAGE_NUMBER;
    const orderBy = await checkOrderBy(
      queryStrParams.orderBy || DEFAULT_ORDER_BY
    );
    const orderAt = await checkOrderAt(
      queryStrParams.orderAt || DEFAULT_ORDER_AT
    );

    if (!orderBy) return ORDER_BY_ERROR_MESSAGE;
    if (!orderAt) return ORDER_AT_ERROR_MESSAGE;

    const order = [[orderBy, orderAt]];

    //-- end with pagination  ---

    if (!User) {
      return await checkSequelizeErrors(null, DB_CONNECTION_REFUSED_STATUS);
    }

    try {
      const users = await User.findAll({
        attributes: {
          include: [
            await getDateFormat(fields.CREATION_DATE_NAME_VALUE),
            await getDateFormat(fields.UPDATE_DATE_NAME_VALUE),
          ],
        },
        where: await getLowerFormat(fields.COUNTRY_ID_NAME_VALUE, countryId),
        limit: pageSizeNro,
        offset: pageNro * pageSizeNro,
        order: order,
        raw: true, // Return plain objects
        nest: true, // Format nested objects
      });
      return users;
    } catch (error) {
      console.error(`${GENERIC_ERROR_LOG_MESSAGE} Caused by ${error}`);
      return await checkSequelizeErrors(error, error.name);
    }
  } catch (error) {
    msgLog = GENERIC_ERROR_LOG_MESSAGE + `Caused by ${error}`;
    console.log(msgLog);

    userList = await checkSequelizeErrors(error, DB_CONNECTION_ERROR_STATUS);
  }
  return userList;
};

module.exports = {
  getLikeCountryId,
};
