# books-backend-starter-repo
A Backend Mini Project - using Node.js and Express

This repository is a ready-to-run starter backend for the books & reviews assignment. It implements all required endpoints, authentication, and a small Axios-based client that demonstrates the four requested methods.

## Made by T Raihan

## Requirements

- Node.js (14+)

## Setup

1. Clone the repo.
2. `npm install`
3. Create a `.env` file from `.env.example` and set `JWT_SECRET`.
4. `npm start` to run the server on port 3000 (or the port in your .env).
5. In another terminal you can run `npm run client` to execute the `client.js` demo.

## Endpoints (map to tasks)

- `GET /books` → Task 1 (Get all books)
- `GET /books/isbn/:isbn` → Task 2 (Get book by ISBN)
- `GET /books/author/:author` → Task 3 (Get books by author)
- `GET /books/title/:title` → Task 4 (Get books by title)
- `GET /books/:isbn/reviews` → Task 5 (Get book reviews)
- `POST /auth/register` → Task 6 (Register new user)
- `POST /auth/login` → Task 7 (Login user; returns JWT)
- `PUT /books/:isbn/review` → Task 8 (Add/modify review) **(requires Bearer token)**
- `DELETE /books/:isbn/review` → Task 9 (Delete review) **(requires Bearer token)**

### Example usage

Register & login using curl (replace values):

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"pass123"}'

# login -> receive { "token": "..." }
