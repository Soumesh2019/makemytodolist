const express = require("express");
const router = express.Router();

const todo = require("../controllers/todoController");

router.get("/todo", todo);

module.exports = router;
