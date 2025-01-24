// Models
const { User } = require('../../models/sequelize/user');

// Enums
const { sequelizeConnection } = require('../../enums/sequelize/errors');
const { validateUser } = require('../../enums/validation/user/validations');
const { fields } = require('../../enums/common/users');

// Helpers
const { getDateFormat } = require('../../helpers/sequelize/format/date-format');
const { checkSequelizeErrors } = require('../../helpers/sequelize/errors/checkError');
const { validatePathParameters } = require('../../helpers/http/query-string-params');

// Constants
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_REFUSED_STATUS = sequelizeConnection.CONNECTION_REFUSED_ERROR;
const VALIDATE_PATH_PARAMETER_USER = validateUser.VALIDATE_PATH_PARAMETER_USER;
const GENERIC_ERROR_LOG_MESSAGE = 'Error in getById service function.';

/**
 * @description Retrieve a user by ID with all attributes, including formatted dates.
 * @param {Object} event Event containing the path parameter.
 * @returns {Promise<Object|string>} User details or validation/error message.
 * @example
 * {"id":2,"nickname":"JAVIER GONZALEZ","first_name":"Javier","last_name":"Gonzalez","email":"javiBoquita@gmail.com","identification_type":"DNI","identification_number":"2672268765","country_id":"AR","creation_date":"2023-04-23 21:18:11","update_date":"2023-04-23 21:18:11"}
 */
const getById = async (event) => {
  try {
    const userIdParam = event.pathParameters?.id;

    // Validate path parameter
    const isValidParam = await validatePathParameters(userIdParam);
    if (!isValidParam) return VALIDATE_PATH_PARAMETER_USER;

    // Ensure the User model is available
    if (!User) {
      return await checkSequelizeErrors(null, DB_CONNECTION_REFUSED_STATUS);
    }

    try {
      // Fetch user by primary key with all attributes and formatted dates
      const user = await User.findByPk(userIdParam, {
        attributes: {
          include: [
            await getDateFormat(fields.CREATION_DATE_NAME_VALUE),
            await getDateFormat(fields.UPDATE_DATE_NAME_VALUE),
          ],
        },
        raw: true, // Return plain objects
        nest: true, // Format nested objects
      });

      return user || `User with ID ${userIdParam} not found.`;
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
  getById,
};
