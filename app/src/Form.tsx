import { useState } from "react";
import { type z, ZodError } from "zod";

import FormContext, { type FormContextState } from "./FormContext";

interface ChildrenProps {
  isSubmitting: boolean;
  formErrorMessage: string | undefined;
}

export interface FormProps<Schema extends z.ZodType> {
  children: (props: ChildrenProps) => React.ReactNode;
  className?: string;
  onSubmit: (validatedData: z.output<Schema>) => Promise<void>;
  schema: Schema;
}

export default function Form<Schema extends z.ZodType>({
  children,
  className,
  onSubmit,
  schema,
}: FormProps<Schema>): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormContextState>({});

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setFormState({});

    const formData = Object.fromEntries(new FormData(e.target));

    try {
      const validatedData = schema.parse(formData);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        setFormState({ fieldError: error });
        return;
      }

      if (error instanceof Error) {
        setFormState({ formError: error });
        return;
      }

      setFormState({ formError: new Error("Unable to submit form") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormContext value={formState}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className={className} onSubmit={handleSubmit}>
        {children({
          isSubmitting,
          formErrorMessage: formState.formError?.message,
        })}
      </form>
    </FormContext>
  );
}
