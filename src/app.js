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

app.use(express.static("public"));
app.use(cookieParser());

//routes import

import userRouter from "./routes/user.router.js";

//routes delcration
app.use("/api/v1/users", userRouter);

// http://localhost:8000/users/login
export { app };
