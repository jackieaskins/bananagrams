import { Locator, Page } from "@playwright/test";

export class JoinGamePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get usernameInput(): Locator {
    return this.page.getByLabel("Username");
  }

  get joinGameButton(): Locator {
    return this.page.getByRole("button", { name: "Join game" });
  }

  async joinGame(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.joinGameButton.click();
  }
}
