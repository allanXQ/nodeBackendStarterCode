require("module-alias/register");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("@middleware");
const { DBConn } = require("@config");

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/v1/app", require("./routes/app/index"));
// app.use("/api/v1/auth", require("./routes/auth/index"));
// app.use("/api/v1/user", require("./routes/user/index"));

// app.use("/api/v1/ZAdmin", require("./routes/admin"));

app.use(errorHandler);

DBConn(app, port);
