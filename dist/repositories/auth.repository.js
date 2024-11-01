"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserSignIn = void 0;
const result_1 = require("@badrap/result");
const client_1 = __importDefault(require("../client"));
const library_1 = require("@prisma/client/runtime/library");
const databaseErrors_1 = require("../errors/databaseErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Finds a user by their email and checks if the provided password matches the stored hashed password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The plain text password provided by the user for authentication.
 * @returns {Promise<DbResult<User>>} A promise that resolves to a `DbResult` containing either:
 * - The user object if credentials are valid.
 * - An `InvalidCredentials` error if the credentials are invalid.
 *
 */
const findUserSignIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        const isMatch = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!user || !isMatch) {
            return result_1.Result.err(new databaseErrors_1.InvalidCredentials());
        }
        return result_1.Result.ok(user);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.findUserSignIn = findUserSignIn;
/**
 * Creates a new user with the given username, email, and password.
 *
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} password - The password for the new user (should be hashed before being passed).
 * @returns {Promise<DbResult<User>>} A promise that resolves to a `DbResult` containing either:
 * - The newly created user object.
 * - An `EmailAlreadyExists` error if the email is already registered.
 *
 */
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield client_1.default.user.create({
            data: {
                username,
                email,
                password,
            },
        });
        return result_1.Result.ok(newUser);
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return result_1.Result.err(new databaseErrors_1.EmailAlreadyExists());
            }
        }
        return result_1.Result.err(new Error());
    }
});
exports.createUser = createUser;
