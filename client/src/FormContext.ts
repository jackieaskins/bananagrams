import { createContext, use } from "react";
import type { ZodError } from "zod";

export interface FormContextState {
  formError?: Error;
  fieldError?: ZodError;
}

const FormContext = createContext<FormContextState>({});

export function useFieldErrorMessage(name: string): string | undefined {
  const fieldError = use(FormContext).fieldError;
  const fieldPath = name.split(".");

  return fieldError?.issues.find(
    ({ path }) =>
      path.length === fieldPath.length &&
      path.every((part, index) => fieldPath[index] === part),
  )?.message;
}

export default FormContext;
