'use strict';
//Const-vars
let date;
let dateNow;

/**
 * @description gets the current date in YYYY-MM-DD HH:MM:SS format
 * @returns a string with the indicated date format
 * @example {'2023-03-18 21:06:15'}
 */
const currentDateTime = async () => {
  try {
    date = new Date();
    dateNow =
      date.getFullYear() +
      '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + date.getDate()).slice(-2) +
      ' ' +
      ('00' + date.getHours()).slice(-2) +
      ':' +
      ('00' + date.getMinutes()).slice(-2) +
      ':' +
      ('00' + date.getSeconds()).slice(-2);
  } catch (error) {
    console.error(
      `Error in currentDateTime() function. Caused by ${error}. Specific stack is ${error.stack}`,
    );
  }
  return dateNow;
};

module.exports = {
  currentDateTime,
};
