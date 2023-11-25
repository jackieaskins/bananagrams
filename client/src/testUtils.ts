import {
  RenderOptions,
  RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

// https://testing-library.com/docs/user-event/intro
export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">,
): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, options),
  };
}
