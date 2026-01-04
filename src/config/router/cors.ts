import cors from "cors";
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "https://s95s38l9-8000.asse.devtunnels.ms",
];
export const corsConfig = () => {
  const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
      console.log("@CORS:origin", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("@CORS:denied", origin);
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tunnel-skip-antiphishing-page"],
    credentials: true,
  };

  return cors(corsOptions);
};
