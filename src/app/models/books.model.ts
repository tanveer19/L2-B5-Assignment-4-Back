import { model, Schema } from "mongoose";
import {
  Genre,
  IBookDocument,
  IBookModel,
} from "../interfaces/books.interface";

const bookSchema = new Schema<IBookDocument, IBookModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: Object.values(Genre),
        message: "Invalid genre type",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^(?:ISBN(?:-1[03])?:?\s)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\s]){3})[-\s0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)(?:97[89][-\s]?)?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X]$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid ISBN!`,
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false, // Disables the __v field
  }
);

// instance methods
bookSchema.methods.checkAvailability = function (quantity: number): boolean {
  return this.available && this.copies >= quantity;
};

// static methods
bookSchema.statics.updateAvailability = async function (bookId: string) {
  const book = await this.findById(bookId);
  if (!book) throw new Error("Book not found");

  if (book.copies === 0 && book.available) {
    book.available = false;
    await book.save();
  } else if (book.copies > 0 && !book.available) {
    book.available = true;
    await book.save();
  }
};

// middleware
bookSchema.pre("save", function (next) {
  if (this.isModified("copies")) {
    this.available = this.copies > 0;
  }
  next();
});
// prevent removing books with active borrows
bookSchema.pre("deleteOne", { document: true }, async function (next) {
  const Borrow = model("Borrow");
  const borrowedCount = await Borrow.countDocuments({ book: this._id });

  if (borrowedCount > 0) {
    throw new Error("cannot delete book with active borrows");
  }
  next();
});

const Book = model<IBookDocument, IBookModel>("Book", bookSchema);

export default Book;
