const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
  let validusers = users.filter((user) => {
    return user.username === username;
  });

  return validusers.length > 0;
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({"message": "Unable to register user."});
  }

  if (!doesExist(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({"message": "User successfully registered."});
  } else {
    return res.status(404).json({"message": "User already exists."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({"message": "Book not found."});
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let author_books = []
  for (const isbn in books) {
    if (books[isbn]["author"] === author) {
      author_books.push(books[isbn]);
    }
  }

  res.status(200).json(author_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let title_books = []
  for (const isbn in books) {
    if (books[isbn]["title"] === title) {
      title_books.push(books[isbn]);
    }
  }
  res.status(200).json(title_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]["reviews"]);
  } else {
    return res.status(404).json({"message": "Book not found."});
  }
});

module.exports.general = public_users;
