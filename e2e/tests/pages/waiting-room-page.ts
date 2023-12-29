import { Locator, Page } from "@playwright/test";

export class WaitingRoomPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get gameHeader(): Locator {
    return this.page.getByRole("heading").first();
  }

  get notReadyStatusButton(): Locator {
    return this.page.getByLabel("Set status as not ready");
  }

  get spectatingStatusButton(): Locator {
    return this.page.getByLabel("Set status as spectating");
  }

  get readyStatusButton(): Locator {
    return this.page.getByLabel("Set status as ready");
  }

  get startGameButton(): Locator {
    return this.page.getByRole("button", { name: "Start game" });
  }

  get kickButtons(): Locator {
    return this.page.getByRole("button", { name: /^Kick/ });
  }

  async readyUpAndStartGame(): Promise<void> {
    await this.readyStatusButton.click();
    await this.startGameButton.click();
  }
}
