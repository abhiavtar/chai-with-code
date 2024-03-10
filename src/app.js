import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  }),
);

app.use(express.json({ limit: "20kb" })); // rate limiter for much request your user can make

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(cookieParser());
export { app };
