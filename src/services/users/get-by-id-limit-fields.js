// Models
const { User } = require('../../models/sequelize/user');

// Enums
const { sequelizeConnection } = require('../../enums/sequelize/errors');
const { validateUser } = require('../../enums/validation/user/validations');
const { fields } = require('../../enums/common/users');

// Helpers
const { checkSequelizeErrors } = require('../../helpers/sequelize/errors/checkError');
const { validatePathParameters } = require('../../helpers/http/query-string-params');

// Constants
const DB_CONNECTION_ERROR_STATUS = sequelizeConnection.CONNECTION_ERROR;
const DB_CONNECTION_REFUSED_STATUS = sequelizeConnection.CONNECTION_REFUSED_ERROR;
const VALIDATE_PATH_PARAMETER_USER = validateUser.VALIDATE_PATH_PARAMETER_USER;
const GENERIC_ERROR_LOG_MESSAGE = 'Error in getByIdLimit service function.';

/**
 * @description Retrieves a user by ID with specific attributes.
 * @param {Object} event Event containing the path parameter.
 * @returns {Promise<Object|string>} User details or validation/error message.
 * @example
 * {"id":2,"nickname":"JAVIER GONZALEZ","email":"javiBoquita@gmail.com","identification_type":"DNI","identification_number":"2672268765","country_id":"AR"}
 */
const getByIdLimit = async (event) => {
  try {
    const userIdParam = event.pathParameters?.id;

    // Validate path parameter
    const validatePathParam = await validatePathParameters(userIdParam);
    if (!validatePathParam) return VALIDATE_PATH_PARAMETER_USER;

    // Ensure the User model is available
    if (!User) {
      return await checkSequelizeErrors(null, DB_CONNECTION_REFUSED_STATUS);
    }

    try {
      // Fetch user by primary key with specified attributes
      const user = await User.findByPk(userIdParam, {
        attributes: {
          exclude: [fields.FIRST_NAME_NAME_VALUE, fields.LAST_NAME_NAME_VALUE, fields.CREATION_DATE_NAME_VALUE, fields.UPDATE_DATE_NAME_VALUE],
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
  getByIdLimit,
};
