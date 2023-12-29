import { Locator, Page } from "@playwright/test";

export class SpectatorPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get header(): Locator {
    return this.page.getByRole("heading", { name: "Spectator view" });
  }
}
