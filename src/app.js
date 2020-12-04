const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const rateLimit = require("./middleware/rateLimit");

require("dotenv").config();

const PORT = process.env.PORT || 3100;
const environment = process.env.NODE_ENV || "development";

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (environment === "development") app.use(rateLimit.limiter);
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send(`Listening on Port ${PORT} / at ${environment} Env `);
});

app.get("/ping", (req, res) => {
  res.send({ status: "Ok" });
});
// CORS ALL ACCESS
app.use(cors());
app.disable("x-powered-by");

require("./routes")(app);

app.listen(PORT, () => {
  console.info(`[ApiServer] Listening on Port ${PORT} / at ${environment} Env`);
});

module.exports = app;
