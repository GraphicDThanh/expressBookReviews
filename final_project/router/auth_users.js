const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  })

  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({"message": "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: {
        username: username,
        password: password
      }
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send({"message": "User successfully logged in"});
  } else {
    return res.status(404).json({"message": "Invalid login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  const review = req.body.review;
  if (!review) {
    return res.status(404).json({message: "Review not provided"});
  }

  const isbn = req.params.isbn;
  if (books[isbn]) {
    books[isbn]["reviews"][user.data.username] = review;
    return res.status(200).json({message: "Review added successfully"});
  }

  return res.status(404).json({message: "Book not found"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    delete books[isbn]["reviews"][user.data.username];
    return res.status(200).json({message: `Review of user ${user.data.username} deleted successfully`});
  }

  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
