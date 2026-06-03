import mongoose from "mongoose";

export function isValidObjectId(value: string): boolean {
  return mongoose.Types.ObjectId.isValid(value);
}

export function toObjectId(value: string) {
  if (!isValidObjectId(value)) {
    throw new Error("Invalid ObjectId");
  }
  return new mongoose.Types.ObjectId(value);
}
