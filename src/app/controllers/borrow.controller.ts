import express, { Request, Response } from "express";
import Book from "../models/books.model";
import Borrow from "../models/borrow.model";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", (async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // 1. Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // 2. Check availability
    if (!book.checkAvailability(quantity)) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough copies available" });
    }

    // 3. Deduct quantity and update availability
    book.copies -= quantity;
    await book.save();
    await Book.updateAvailability(book._id as string);

    // 4. Save borrow record
    const borrow = await Borrow.create({ book: book._id, quantity, dueDate });

    const borrowObj = borrow.toObject();
    const data = {
      _id: borrowObj._id,
      book: borrowObj.book,
      quantity: borrowObj.quantity,
      dueDate: borrowObj.dueDate,
      createdAt: borrowObj.createdAt,
      updatedAt: borrowObj.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}) as express.RequestHandler);

borrowRoutes.get("/", (async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookInfo.title",
            isbn: "$bookInfo.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    // Explicitly construct objects with book first
    const data = summary.map((item) => ({
      book: item.book,
      totalQuantity: item.totalQuantity,
    }));

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}) as express.RequestHandler);
