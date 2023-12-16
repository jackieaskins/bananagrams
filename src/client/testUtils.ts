import {
  RenderOptions,
  RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

export const CURRENT_PLAYER_ID = "currentPlayerId";

// https://testing-library.com/docs/user-event/intro
export function renderComponent(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">,
): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, options),
  };
}
