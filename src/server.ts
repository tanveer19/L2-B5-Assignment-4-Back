import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
const PORT = 5000;
require("dotenv").config();

let server: Server;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("connected to Mongodb using mongoose");
    server = app.listen(PORT, () => {
      console.log(`app is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
