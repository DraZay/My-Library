const http = require('http');
const fs = require('fs');

// Load users and books from JSON files
let users = JSON.parse(fs.readFileSync('users.json', 'utf8')) || [];
let books = JSON.parse(fs.readFileSync('books.json', 'utf8')) || [];

// Save users and books to JSON files
function saveData() {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
}

// Create a new user
function createUser(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const user = JSON.parse(body);
    users.push(user);
    saveData();
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  });
}

// Authenticate a user
function authenticateUser(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { username, password } = JSON.parse(body);
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
    }
  });
}

// Get all users
function getAllUsers(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
}

// Create a new book
function createBook(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const book = JSON.parse(body);
    books.push(book);
    saveData();
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(book));
  });
}

// Delete a book
function deleteBook(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { id } = JSON.parse(body);
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
      const deletedBook = books.splice(index, 1)[0];
      saveData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedBook));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Book not found');
    }
  });
}

// Loan out a book
function loanOutBook(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { id, userId } = JSON.parse(body);
    const book = books.find((b) => b.id === id);
    if (book) {
      book.loanedTo = userId;
      saveData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(book));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end