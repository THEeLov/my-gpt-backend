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
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../client"));
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ error: "You are not authorized - No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res
                .status(401)
                .json({ error: "You are not authorized - Invalid token" });
        }
        const userId = decode.userId;
        const user = yield client_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        req.user = user;
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Internal server error - token validation" });
    }
});
exports.protectedRoute = protectedRoute;
