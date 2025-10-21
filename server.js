const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// File paths
const booksFile = path.join(__dirname, 'data', 'books.json');
const usersFile = path.join(__dirname, 'data', 'users.json');

// Helper functions
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Load data
let booksData = readJSON(booksFile);
let usersData = readJSON(usersFile);



// Get all books
app.get('/books', (req, res) => {
  res.json(booksData.books);
});

// Get book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const book = booksData.books.find(b => b.isbn === req.params.isbn);
  if (book) res.json(book);
  else res.status(404).json({ message: 'Book not found' });
});

// Get all books by Author
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = booksData.books.filter(b => b.author.toLowerCase() === author);
  if (result.length) res.json(result);
  else res.status(404).json({ message: 'No books found for this author' });
});

// Get all books by Title
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = booksData.books.filter(b => b.title.toLowerCase().includes(title));
  if (result.length) res.json(result);
  else res.status(404).json({ message: 'No books found with this title' });
});

// Get book Review
app.get('/books/review/:isbn', (req, res) => {
  const book = booksData.books.find(b => b.isbn === req.params.isbn);
  if (book && book.reviews) res.json(book.reviews);
  else res.status(404).json({ message: 'No reviews found for this book' });
});


// Register New user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required' });

  const userExists = usersData.users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  usersData.users.push({ username, password });
  writeJSON(usersFile, usersData);
  res.json({ message: 'User registered successfully' });
});

// Login as Registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersData.users.find(u => u.username === username && u.password === password);
  if (user) res.json({ message: 'Login successful' });
  else res.status(401).json({ message: 'Invalid username or password' });
});



// Add/Modify a book review
app.put('/books/review/:isbn', (req, res) => {
  const { username, review } = req.body;
  const book = booksData.books.find(b => b.isbn === req.params.isbn);

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!username || !review)
    return res.status(400).json({ message: 'Username and review are required' });

  if (!book.reviews) book.reviews = {};
  book.reviews[username] = review;

  writeJSON(booksFile, booksData);
  res.json({ message: 'Review added/updated successfully' });
});

// Delete book review added by that user
app.delete('/books/review/:isbn', (req, res) => {
  const { username } = req.body;
  const book = booksData.books.find(b => b.isbn === req.params.isbn);

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!username) return res.status(400).json({ message: 'Username is required' });
  if (!book.reviews || !book.reviews[username])
    return res.status(404).json({ message: 'Review not found for this user' });

  delete book.reviews[username];
  writeJSON(booksFile, booksData);
  res.json({ message: 'Review deleted successfully' });
});



app.get('/', (req, res) => {
  res.send('📚 Bookstore API running! Try /books or /books/isbn/:isbn');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});