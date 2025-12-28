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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, text }) {
    try {
        if (!to)
            throw {
                status: "Error",
                statusCode: 400,
                message: "Recipient email is invalid",
            };
        const info = yield transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        return {
            success: true,
            messageId: info.messageId,
        };
    }
    catch (error) {
        console.error("Mailer Error:", error);
        throw {
            status: "Error",
            statusCode: 500,
            message: "Failed to send email",
        };
    }
});
exports.sendMail = sendMail;
