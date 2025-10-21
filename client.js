const axios = require('axios');
const BASE = process.env.BASE_URL || 'http://localhost:3000';

// Get all books – Using async callback function
async function getAllBooks(callback){
  try {
    const res = await axios.get(`${BASE}/books`);
    // pass result via callback
    callback(null, res.data);
  } catch(err){
    callback(err);
  }
}

// Search by ISBN – Using Promises
function searchByISBN(isbn){
  return axios.get(`${BASE}/books/isbn/${encodeURIComponent(isbn)}`)
    .then(resp => resp.data);
}

// Search by Author – using async/await
async function searchByAuthor(author){
  const resp = await axios.get(`${BASE}/books/author/${encodeURIComponent(author)}`);
  return resp.data;
}

// Search by Title – Using Promises
function searchByTitle(title){
  return axios.get(`${BASE}/books/title/${encodeURIComponent(title)}`)
    .then(resp => resp.data);
}

// Demo
if(require.main === module){
  getAllBooks((err, books) => {
    if(err) return console.error('getAllBooks error', err.message || err);
    console.log('All books:', books.map(b => `${b.title} (${b.isbn})`));
  });

  searchByISBN('9780143127741').then(book=>{
    console.log('ISBN search result:', book.title);
  }).catch(()=>console.log('ISBN not found'));

  (async ()=>{
    const byAuthor = await searchByAuthor('John');
    console.log('By Author count:', byAuthor.length);
  })();

  searchByTitle('Example').then(list=>{
    console.log('Titles matching count:', list.length);
  });
}

module.exports = { getAllBooks, searchByISBN, searchByAuthor, searchByTitle };