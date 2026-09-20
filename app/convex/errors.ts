import { ConvexError } from "convex/values";

export class ApplicationError extends ConvexError<{ message: string }> {
  name = "ApplicationError";
}
