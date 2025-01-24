// Models
const { User } = require('../../models/sequelize/user');

// Helpers
const { getDateFormat } = require('../../helpers/sequelize/format/date-format');
const { checkSequelizeErrors } = require('../../helpers/sequelize/errors/checkError');
const { checkOrderBy, checkOrderAt } = require('../../helpers/pagination/users/order');

// Enums
const { sequelizeConnection } = require('../../enums/sequelize/errors');
const { sortingMessage } = require('../../enums/pagination/errors/status-message');
const { fields } = require('../../enums/common/users');
const { orderAt } = require('../../enums/pagination/ordering/orderAt');

// Constants
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_REFUSED_STATUS = sequelizeConnection.CONNECTION_REFUSED_ERROR;
const ORDER_BY_ERROR_MESSAGE = sortingMessage.ORDER_BY_ERROR_MESSAGE;
const ORDER_AT_ERROR_MESSAGE = sortingMessage.ORDER_AT_ERROR_MESSAGE;
const GENERIC_ERROR_LOG_MESSAGE = 'Error in getAll service function.';
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_ORDER_BY = fields.ID_NAME_VALUE;
const DEFAULT_ORDER_AT = orderAt.ASC;

/**
 * @description Fetches paginated users with their attributes.
 * @param {Object} event Event containing query parameters.
 * @returns {Promise<Array|Object>} List of paginated users or error details.
 */
const getAll = async (event) => {
  try {
    const queryStrParams = event.queryStringParameters || {};

    // Pagination parameters
    const pageSizeNro = parseInt(queryStrParams.limit) || DEFAULT_PAGE_SIZE;
    const pageNro = parseInt(queryStrParams.page) || DEFAULT_PAGE_NUMBER;
    const orderBy = await checkOrderBy(queryStrParams.orderBy || DEFAULT_ORDER_BY);
    const orderAt = await checkOrderAt(queryStrParams.orderAt || DEFAULT_ORDER_AT);

    if (!orderBy) return ORDER_BY_ERROR_MESSAGE;
    if (!orderAt) return ORDER_AT_ERROR_MESSAGE;

    const order = [[orderBy, orderAt]];

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
        limit: pageSizeNro,
        offset: pageNro * pageSizeNro,
        order,
        raw: true, // Return plain objects
        nest: true, // Format nested objects
      });
      return users;
    } catch (error) {
      console.error(`${GENERIC_ERROR_LOG_MESSAGE} Caused by ${error}`);
      return await checkSequelizeErrors(error, error.name);
    }
  } catch (error) {
    console.error(`${GENERIC_ERROR_LOG_MESSAGE} Caused by ${error}`);
    return await checkSequelizeErrors(error, DB_CONNECTION_ERROR_STATUS);
  }
};

module.exports = {
  getAll,
};
