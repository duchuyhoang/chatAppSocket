"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationError = void 0;
class CustomValidationError extends Error {
    constructor(message, status, fieldsError) {
        super(message);
        this.status = status;
        this.fieldsError = fieldsError;
    }
}
exports.CustomValidationError = CustomValidationError;
