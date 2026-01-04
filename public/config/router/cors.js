"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://s95s38l9-8000.asse.devtunnels.ms",
];
const corsConfig = () => {
    const corsOptions = {
        origin: (origin, callback) => {
            console.log("@CORS:origin", origin);
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.log("@CORS:denied", origin);
                callback(null, true);
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-tunnel-skip-antiphishing-page"],
        credentials: true,
    };
    return (0, cors_1.default)(corsOptions);
};
exports.corsConfig = corsConfig;
