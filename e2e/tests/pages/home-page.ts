import { Locator, Page } from "@playwright/test";

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get gameNameInput(): Locator {
    return this.page.getByLabel("Game name");
  }

  get usernameInput(): Locator {
    return this.page.getByLabel("Username");
  }

  get createGameButton(): Locator {
    return this.page.getByRole("button", { name: "Create game" });
  }

  async createGame(gameName: string, username: string): Promise<void> {
    await this.gameNameInput.fill(gameName);
    await this.usernameInput.fill(username);
    await this.createGameButton.click();
  }
}
