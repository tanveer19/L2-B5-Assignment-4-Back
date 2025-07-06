# 📚 Library Management Backend

Live site:

https://l2-b5-assignment-4-back.vercel.app/

A professional RESTful API for managing books and borrow records in a library system, built with Node.js, Express, TypeScript, and MongoDB (Mongoose).

---

## 🚀 Features

- **Book Management:**
  - Create, read, update, and delete books.
  - Filter books by genre, sort, and limit results.
- **Borrowing System:**
  - Borrow books with quantity and due date.
  - Automatically updates book availability and copies.
  - Prevents borrowing if not enough copies are available.
- **Borrowed Books Summary:**
  - Aggregated summary of total borrowed quantity per book, including book title and ISBN.
- **Validation & Error Handling:**
  - Robust validation for all endpoints.
  - Clear error messages for invalid operations.
- **Timestamps:**
  - All records include `createdAt` and `updatedAt` fields.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add:

   ```
   MONGODB_URI=mongodb://localhost:27017/library
   PORT=3000
   ```

4. **Run the server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The API will be available at `http://localhost:3000/`.

---

## 📖 API Endpoints

### Books

- **Create Book:**  
  `POST /api/books`
- **Get All Books:**  
  `GET /api/books?filter=GENRE&sortBy=createdAt&sort=desc&limit=5`
- **Get Book by ID:**  
  `GET /api/books/:bookId`
- **Update Book:**  
  `PATCH /api/books/:bookId`
- **Delete Book:**  
  `DELETE /api/books/:bookId`

### Borrow

- **Borrow a Book:**  
  `POST /api/borrow`
- **Borrowed Books Summary:**  
  `GET /api/borrow`

---

## 📦 Project Structure

```
/controllers
  books.controller.ts
  borrow.controller.ts
/models
  books.model.ts
  borrow.model.ts
/interfaces
  books.interface.ts
app.ts
.env
```

---
