"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validateStringLength = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    // return String(password).match(
    //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    // )
    var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (regex.test(password)) {
        return true;
    }
    else
        return false;
};
exports.validatePassword = validatePassword;
const validateStringLength = (username, len) => {
    return String(username).length < len;
};
exports.validateStringLength = validateStringLength;
const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber[0] === '0' && phoneNumber.length === 10) {
        return true;
    }
    else
        return false;
};
exports.validatePhoneNumber = validatePhoneNumber;
