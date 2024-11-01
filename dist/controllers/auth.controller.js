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
exports.signUpUser = exports.signInUser = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const databaseErrors_1 = require("../errors/databaseErrors");
const generateToken_1 = require("../utils/generateToken");
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield (0, auth_repository_1.findUserSignIn)(email, password);
    if (result.isOk) {
        const token = (0, generateToken_1.generateToken)(result.value.id);
        return res.status(200).json({ authToken: token, user: result.value });
    }
    const error = result.error;
    if (error instanceof databaseErrors_1.InvalidCredentials) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }
    return res.status(500).json({ error: "Internal server error" });
});
exports.signInUser = signInUser;
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Password do not match" });
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const result = yield (0, auth_repository_1.createUser)(username, email, hashedPassword);
    if (result.isOk) {
        const token = (0, generateToken_1.generateToken)(result.value.id);
        return res.status(201).json({ authToken: token, user: result.value });
    }
    const error = result.error;
    if (error instanceof databaseErrors_1.EmailAlreadyExists) {
        return res.status(409).json({ error: "Email is already used" });
    }
    return res.status(500).json({ error: "Internal server error" });
});
exports.signUpUser = signUpUser;
