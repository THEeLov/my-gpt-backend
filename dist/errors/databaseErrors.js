"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionError = exports.NoConversationFound = exports.InvalidCredentials = exports.EmailAlreadyExists = void 0;
class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class EmailAlreadyExists extends BaseError {
    constructor() {
        super("Email is already taken");
    }
}
exports.EmailAlreadyExists = EmailAlreadyExists;
class InvalidCredentials extends BaseError {
    constructor() {
        super("Invalid Credentials");
    }
}
exports.InvalidCredentials = InvalidCredentials;
class NoConversationFound extends BaseError {
    constructor() {
        super("No conversation was found");
    }
}
exports.NoConversationFound = NoConversationFound;
class PermissionError extends BaseError {
    constructor() {
        super("No permission");
    }
}
exports.PermissionError = PermissionError;
