import { Document, Model } from "mongoose";

// genre enum

export enum Genre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

// core book interface
export interface IBook {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

// mongoose document interface (extends Ibook and Document)
export interface IBookDocument extends IBook, Document {
  createdAt: Date;
  updatedAt: Date;

  // instance methods
  checkAvailability(quantity: number): boolean;
}

// Mongoose Model Interface (for static methods)
export interface IBookModel extends Model<IBookDocument> {
  // static method to update availability
  updateAvailability(bookId: string): Promise<void>;
}

// Data transfer object for api req
export interface CreateBookDto {
  title?: string;
  author?: string;
  genre?: Genre;
  isbn?: string;
  description?: string;
  copies?: number;
  available?: boolean;
}

export interface BookResponseDto {
  success: boolean;
  message: string;
  data?: any; // Or your Book type/interface
  error?: string;
}

// for the borrow summary aggregation
export interface BorrowSummaryDto {
  book: {
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}
