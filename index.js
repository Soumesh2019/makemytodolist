require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cookieParser());

const todo = require("./routers/toDoRouter");
const registerRouter = require("./routers/registerRouter");
const loginRouter = require("./routers/loginRouter");
const userRouter = require("./routers/userRouter");
const todoListRouter = require("./routers/todoListRouter");

mongoose.connect(
  `mongodb+srv://admin-sk0564845:${process.env.MONGODBPASS}@mycluster.m3q9x.mongodb.net/toDoDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => console.log("MongodB Connected"));
mongoose.connection.on("error", () => console.log("Error Connecting Mongodb"));

app.get("/", (req, res) => {
  res.render("home", {
    error: "",
  });
});

// Todo HomePage
app.use(todo);

// Register The User
app.use(registerRouter);

// Login The User
app.use(loginRouter);

// User's Todo Section
app.use(userRouter);

// User's ToDoList Actions
app.use(todoListRouter);

app.get("*", (req, res) => {
  res.status(404).send("Error 404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running on " + PORT));
