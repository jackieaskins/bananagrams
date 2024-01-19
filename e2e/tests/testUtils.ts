import { Page, test as base, expect } from "@playwright/test";
import { GamePage } from "./pages/game-page";
import { HomePage } from "./pages/home-page";
import { JoinGamePage } from "./pages/join-game-page";
import { SpectatorPage } from "./pages/spectator-page";
import { WaitingRoomPage } from "./pages/waiting-room-page";

export const TILE_SIZE = 32;
export const FIRST_HAND_TILE_POSITION = { x: 284, y: 562 };
export const FIRST_BOARD_POSITION = { x: 304, y: 400 };

export interface PageFixtures {
  gotoAndDismissTutorialModal: (path: string) => Promise<void>;
  gamePage: GamePage;
  homePage: HomePage;
  joinGamePage: JoinGamePage;
  spectatorPage: SpectatorPage;
  waitingRoomPage: WaitingRoomPage;
}

interface MultiPageFixtures extends PageFixtures {
  page: Page;
}

function gotoAndDismissTutorialModal(page: Page) {
  return async (path: string) => {
    await page.goto(path);
    await page.getByRole("button", { name: "No thanks" }).click();
    await expect(page.getByRole("dialog")).not.toBeInViewport();
  };
}

export const test = base.extend<PageFixtures>({
  gotoAndDismissTutorialModal: async ({ page }, use) => {
    await use(gotoAndDismissTutorialModal(page));
  },
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  joinGamePage: async ({ page }, use) => {
    await use(new JoinGamePage(page));
  },
  spectatorPage: async ({ page }, use) => {
    await use(new SpectatorPage(page));
  },
  waitingRoomPage: async ({ page }, use) => {
    await use(new WaitingRoomPage(page));
  },
});

export const multiplayerTest = base.extend<{
  firstPlayerPages: MultiPageFixtures;
  secondPlayerPages: MultiPageFixtures;
}>({
  firstPlayerPages: async ({ context }, use) => {
    const page = await context.newPage();
    await use({
      gotoAndDismissTutorialModal: gotoAndDismissTutorialModal(page),
      page,
      gamePage: new GamePage(page),
      homePage: new HomePage(page),
      joinGamePage: new JoinGamePage(page),
      spectatorPage: new SpectatorPage(page),
      waitingRoomPage: new WaitingRoomPage(page),
    });
  },
  secondPlayerPages: async ({ context }, use) => {
    const page = await context.newPage();
    await use({
      gotoAndDismissTutorialModal: gotoAndDismissTutorialModal(page),
      page,
      gamePage: new GamePage(page),
      homePage: new HomePage(page),
      joinGamePage: new JoinGamePage(page),
      spectatorPage: new SpectatorPage(page),
      waitingRoomPage: new WaitingRoomPage(page),
    });
  },
});
