// models
require("./models/User");
require("./models/Advert");
require("./models/Message");
require("./models/Conversation");
// libs
require("dotenv").config({
  path: process.env.__DEV__ ? ".env" : "variables.env",
});
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
// routes
const authRoutes = require("./routes/authRoutes");
const advertRoutes = require("./routes/advertRoutes");
const chatRoutes = require("./routes/chatRoutes");
// vars
const host = process.env.HOST || "0.0.0.0";
const port = +process.env.PORT || 5000;
const mongoUri = process.env.DB_URI;
// utils
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// middlewares
app.use((req, _, next) => {
  req.io = io;
  next();
});
// paths
app.use(authRoutes);
app.use(advertRoutes);
app.use(chatRoutes);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

io.on("connection", (socket) => {
  console.log("socket connected!!!");
});

server.listen(port, host, () => {
  console.log(`Backend: ${host}:${port}`);
});
