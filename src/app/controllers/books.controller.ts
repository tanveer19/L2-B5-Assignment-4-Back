import express, { Request, Response } from "express";
import Book from "../models/books.model";
import { BookResponseDto } from "../interfaces/books.interface";
import { Document } from "mongoose";

export const booksRoutes = express.Router();

function formatBook(book: Document | any) {
  const bookObj = book.toObject ? book.toObject() : book;
  return {
    _id: bookObj._id,
    title: bookObj.title,
    author: bookObj.author,
    genre: bookObj.genre,
    isbn: bookObj.isbn,
    description: bookObj.description,
    copies: bookObj.copies,
    available: bookObj.available,
    createdAt: bookObj.createdAt,
    updatedAt: bookObj.updatedAt,
  };
}

// 1. create book
booksRoutes.post("/", async (req: Request, res: Response<BookResponseDto>) => {
  try {
    const book = await Book.create(req.body);

    const data = formatBook(book);

    res.status(200).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 2. Get All Books

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    // Build filter object
    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy as string] = sort === "asc" ? 1 : -1;

    // Fetch books with filter, sort, and limit
    const books = await Book.find(query).sort(sortObj).limit(Number(limit));

    const data = books.map(formatBook);

    res.status(201).json({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 3. Get Book by ID

booksRoutes.get("/:bookId", (async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    const data = formatBook(book);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}) as express.RequestHandler);

// 4. Update Book

booksRoutes.put("/:bookId", (async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const data = formatBook(book);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}) as express.RequestHandler);

// 5. Delete Book

booksRoutes.delete("/:bookId", (async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}) as express.RequestHandler);
