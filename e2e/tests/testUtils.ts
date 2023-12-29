import { Page, test as base } from "@playwright/test";
import { GamePage } from "./pages/game-page";
import { HomePage } from "./pages/home-page";
import { JoinGamePage } from "./pages/join-game-page";
import { SpectatorPage } from "./pages/spectator-page";
import { WaitingRoomPage } from "./pages/waiting-room-page";

export interface PageFixtures {
  gamePage: GamePage;
  homePage: HomePage;
  joinGamePage: JoinGamePage;
  spectatorPage: SpectatorPage;
  waitingRoomPage: WaitingRoomPage;
}

interface MultiPageFixtures extends PageFixtures {
  page: Page;
}

export const test = base.extend<PageFixtures>({
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
      page,
      gamePage: new GamePage(page),
      homePage: new HomePage(page),
      joinGamePage: new JoinGamePage(page),
      spectatorPage: new SpectatorPage(page),
      waitingRoomPage: new WaitingRoomPage(page),
    });
  },
});
