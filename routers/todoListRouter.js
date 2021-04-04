const express = require("express");
const route = express.Router();

const { submitItem, deleteItem } = require("../controllers/todoListController");

route.post("/submit", submitItem);

route.post("/delete", deleteItem);

route.post("/logout", (req, res) => {
  res.setHeader("set-cookie", ["isLoggedIn=false", "userId=null"]);
  res.redirect("/");
});

module.exports = route;
