import { Locator, Page } from "@playwright/test";

type Position = {
  x: number;
  y: number;
};

export class GamePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get canvas(): Locator {
    return this.page.locator("canvas").nth(1);
  }

  get bananasButton(): Locator {
    return this.page.getByRole("button", { name: "Bananas!" });
  }

  get peelButton(): Locator {
    return this.page.getByRole("button", { name: "Peel!" });
  }

  get shuffleHandButton(): Locator {
    return this.page.getByRole("button", { name: "Shuffle hand" });
  }

  get switchToSpectatorButton(): Locator {
    return this.page.getByRole("button", { name: "Switch to spectator" });
  }

  get confirmSpectateButton(): Locator {
    return this.page.getByRole("button", { name: "Spectate" });
  }

  async dumpTileDrag(position: Position): Promise<void> {
    await this.dragTile(position, { x: 204, y: 562 });
  }

  async drumpTileClick(position: Position): Promise<void> {
    await this.clickAndMoveTile(position, { x: 204, y: 562 });
  }

  async dragTile(from: Position, to: Position): Promise<void> {
    await this.page.mouse.move(from.x, from.y);
    await this.page.mouse.down();

    await this.page.mouse.move(to.x, to.y);
    await this.page.mouse.up();
  }

  async clickAndMoveTile(from: Position, to: Position): Promise<void> {
    await this.canvas.click({ position: from });
    await this.canvas.click({ position: to });
  }

  async switchToSpecator(): Promise<void> {
    await this.switchToSpectatorButton.click();
    await this.confirmSpectateButton.click();
  }
}
