import path from "path";

import "dotenv/config";

import express from "express";
import "express-async-errors";
import "./database/connection";
import routes from "./routes";
import errorHandler from "./errors/handler";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/upload", express.static(path.join(__dirname, "..", "upload")));
app.use(errorHandler);

app.listen(app.listen(process.env.PORT || 3333));
