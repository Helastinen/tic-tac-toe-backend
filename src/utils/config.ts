import dotenv from "dotenv";

dotenv.config(); // import environment values from .env

export const PORT = process.env.PORT!;
export const MONGODB_URI = process.env.MONGODB_URI;
export const MONGODB_URI_TEST = process.env.MONGODB_TEST_URI;