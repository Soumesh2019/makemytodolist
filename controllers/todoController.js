const todo = (req, res) => {
  if (req.cookies["isLoggedIn"] === "true") {
    res.redirect("/user/" + req.cookies["userId"]);
  } else {
    res.render("home", {
      error: "Please Login or Register to continue",
    });
  }
};

module.exports = todo;
