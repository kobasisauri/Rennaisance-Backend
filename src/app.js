const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renaissancehandmade@gmail.com",
    pass: "xmsecrhajeebtqro",
  },
});
const fileStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, "folders");
  },
  filename: (req, file, cb) => {
    let parts = file.originalname.split("@");
    cb(null, `${req.body.firstName + "-" + req.body.lastName}.zip`);
  },
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage }).array("files"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ message: "Uploaded successfully" });
  const MailText = `
        name: ${req.body.name}
        email: ${req.body.email}
        message: ${req.body.message}
        `;
  transporter.sendMail({
    from: "renaissancehandmade",
    to: "renaissancehandmade@gmail.com",
    subject: "შეკვეთა",
    text: MailText,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
