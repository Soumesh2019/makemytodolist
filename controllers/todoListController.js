const userModel = require("../models/userModel");

const submitItem = (req, res) => {
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
};

const deleteItem = (req, res) => {
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
};

module.exports = { submitItem, deleteItem };
