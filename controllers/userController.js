const userModel = require("../models/userModel");

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
  let month = new Date().getUTCMonth() + 1;
  let year = new Date().getUTCFullYear();
  let date = day + "-" + month + "-" + year;

  return date;
}

const userController = (req, res) => {
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
      } else {
        console.log(err.message);
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = userController;
