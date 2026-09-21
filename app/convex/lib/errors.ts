// eslint-disable-next-line no-restricted-imports
import { ConvexError } from "convex/values";

export class ApplicationError extends ConvexError<{ message: string }> {
  name = "ApplicationError";

  constructor(message: string) {
    super({ message });
  }
}
