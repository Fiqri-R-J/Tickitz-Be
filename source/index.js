require("dotenv").config();
const middleware = require("./middleware/log");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const PORT = process.env.PORT || 6999;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//koneksi cookie-parser
app.use(cookieParser());

//koneksi body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//koneksi cors
app.use(cors());

// koneksi middleware
app.use(middleware.logRequest);
// app.use(express.json()) // body-parser, menggunakan middleware

// koneksi helmet
app.use(helmet());

// koneksi xss
app.use(xss());

// koneksi express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// koneksi routes
app.use("/users", require("./routes/users"));
app.use("/movies", require("./routes/movies"));
app.use("/auth", require("./routes/auth"));
app.use("/schedules", require("./routes/schedules"));
app.use("/payments", require("./routes/payments"));

app.get("/", (req, res) => {
  res.json({
    message: "TICKITZ AVENGERS",
  });
});

// app.use(middleware.urlValidator)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
