const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cookieParser());
const saltRounds = 10;

function greeting() {
  let greetings = "";
  let time = new Date().getHours();
  if (time >= 00 && time <= 10) {
    greetings = "Good Morning";
  } else if (time >= 11 && time <= 15) {
    greetings = "Good Afternoon";
  } else if (time >= 16 && time <= 21) {
    greetings = "Good Evening";
  } else if (time >= 22) {
    greetings = "Good Night";
  }
  return greetings;
}

function todaysDate() {
  let day = new Date().getDate();
  let month =(new Date().getUTCMonth())+1;
  let year = new Date().getUTCFullYear();
  let date = day + "-" + month + "-" + year;

  return date;
}

mongoose.connect(
  "mongodb+srv://admin-sk0564845:process.env.PASSWORD@mycluster.m3q9x.mongodb.net/toDoDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide username"],
  },
  password: {
    type: String,
    required: [true, "Please Provide password"],
  },
  email: {
    type: String,
    required: [true, "Please Provide email"],
  },
  toDoItem: Array,
});

const userModel = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home", {
    error: "",
  });
});

app.get("/todo", (req, res) => {
  if (req.cookies["isLoggedIn"] === "true") {
    res.redirect("/user/" + req.cookies["userId"]);
  } else {
    res.render("home", {
      error: "Please Login or Register to continue",
    });
  }
});

// Register The User
app
  .route("/register")
  .get((req, res) => {
    res.render("register", {
      error: "",
    });
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    userModel.findOne({ email: email }, (err, foundUser) => {
      if (!foundUser) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (!err) {
            const user = new userModel({
              username: username,
              email: email,
              password: hash,
            });
            user.save((err, result) => {
              if (!err) {
                res.setHeader("set-cookie", [
                  "isLoggedIn= true; httponly",
                  `userId= ${result._id}; httponly`,
                ]);
                res.redirect("/user/" + result._id);
              }
            });
          } else {
            console.log(err);
            res.redirect("/register");
          }
        });
      } else {
        res.render("register", {
          error: "User already Exists",
        });
      }
    });
  });

// Login The User
app
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      error: "",
    });
  })
  .post((req, res) => {
    const email = req.body.email;
    const userpassword = req.body.password;

    userModel.findOne({ email: email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(userpassword, foundUser.password, function (
            err,
            result
          ) {
            if (result) {
              res.setHeader("set-cookie", [
                "isLoggedIn= true; httponly",
                `userId= ${foundUser._id}; httponly`,
              ]);
              res.redirect("/user/" + foundUser._id);
            } else if (err) {
              console.log(err);
            } else {
              res.render("login", {
                error: "Wrong passsord",
              });
            }
          });
        } else {
          res.render("login", {
            error: "User not Found",
          });
        }
      } else {
        console.log(err);
        res.redirect("/login");
      }
    });
  });

// Todo Section
app.get("/user/:userId", (req, res) => {
  if (req.cookies["isLoggedIn"] === "true") {
    userId = req.params.userId;
    userModel.findOne({ _id: userId }, (err, foundUser) => {
      if (!err) {
        res.render("todo", {
          userId: userId,
          name: foundUser.username,
          itemsArray: foundUser.toDoItem,
          day: greeting(),
          date: todaysDate(),
          error: "",
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/submit", (req, res) => {
  const userId = req.body.userId;
  const item = req.body.item;

  if (item === "") {
    res.redirect("/user/" + userId);
  } else {
    userModel.updateOne(
      { _id: userId },
      { $push: { toDoItem: item } },
      (err, result) => {
        if (!err) {
          res.redirect("/user/" + userId);
        } else if (err) {
          console.log(err);
          res.send(new Error(err));
        }
      }
    );
  }
});

app.post("/delete", (req, res) => {
  const item = req.body.index;
  const userID = req.body.userID;

  userModel.updateOne(
    { _id: userID },
    { $pull: { toDoItem: { $in: [item] } } },
    (err, result) => {
      if (!err) {
        res.redirect("/user/" + userId);
      } else {
        console.log(err);
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.setHeader("set-cookie", ["isLoggedIn= false"]);
  res.redirect("/");
});

app.get("*", (req, res)=>{
  res.status(404).send("Error 404");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running on"+PORT));
