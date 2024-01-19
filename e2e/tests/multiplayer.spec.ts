import { expect } from "@playwright/test";
import { multiplayerTest as test } from "./testUtils";

const GAME_NAME = "game name";

test.beforeEach(
  "create and join game",
  async ({ firstPlayerPages, secondPlayerPages }) => {
    await firstPlayerPages.gotoAndDismissTutorialModal("/");
    await firstPlayerPages.homePage.createGame(GAME_NAME, "player1");
    await expect(firstPlayerPages.waitingRoomPage.gameHeader).toHaveText(
      GAME_NAME,
    );

    await secondPlayerPages.page.goto(firstPlayerPages.page.url());
    await secondPlayerPages.joinGamePage.joinGame("player2");
  },
);

test("admin can kick player", async ({
  firstPlayerPages,
  secondPlayerPages,
}) => {
  await expect(
    secondPlayerPages.waitingRoomPage.kickButtons,
  ).not.toBeInViewport();

  await firstPlayerPages.waitingRoomPage.kickButtons.click();

  await expect(
    firstPlayerPages.waitingRoomPage.kickButtons,
  ).not.toBeInViewport();

  const disconnectDialog = secondPlayerPages.page.getByRole("alertdialog");
  await expect(disconnectDialog).toHaveText(/^Disconnected/);
  await expect(disconnectDialog).toBeVisible();
});

test("cannot start game if any player is not ready", async ({
  firstPlayerPages,
  secondPlayerPages,
}) => {
  await expect(firstPlayerPages.waitingRoomPage.startGameButton).toBeDisabled();
  await expect(
    secondPlayerPages.waitingRoomPage.startGameButton,
  ).toBeDisabled();

  await firstPlayerPages.waitingRoomPage.readyStatusButton.click();

  await expect(firstPlayerPages.waitingRoomPage.startGameButton).toBeDisabled();
  await expect(
    secondPlayerPages.waitingRoomPage.startGameButton,
  ).toBeDisabled();
});

test("starts game when all players are ready", async ({
  firstPlayerPages,
  secondPlayerPages,
}) => {
  await firstPlayerPages.waitingRoomPage.readyStatusButton.click();
  await secondPlayerPages.waitingRoomPage.readyUpAndStartGame();

  await expect(firstPlayerPages.gamePage.canvas).toBeVisible();
  await expect(secondPlayerPages.gamePage.canvas).toBeVisible();
});

test("starts game when one player is ready and one is spectating", async ({
  firstPlayerPages,
  secondPlayerPages,
}) => {
  await firstPlayerPages.waitingRoomPage.spectatingStatusButton.click();
  await secondPlayerPages.waitingRoomPage.readyUpAndStartGame();

  await expect(firstPlayerPages.spectatorPage.header).toBeVisible();
  await expect(secondPlayerPages.gamePage.canvas).toBeVisible();
});

test("active players can switch to spectators while the game is in progress", async ({
  firstPlayerPages,
  secondPlayerPages,
}) => {
  await firstPlayerPages.waitingRoomPage.readyStatusButton.click();
  await secondPlayerPages.waitingRoomPage.readyUpAndStartGame();
  await firstPlayerPages.gamePage.switchToSpecator();

  await expect(firstPlayerPages.spectatorPage.header).toBeVisible();
  await expect(secondPlayerPages.gamePage.canvas).toBeVisible();

  await secondPlayerPages.gamePage.switchToSpecator();

  await expect(firstPlayerPages.waitingRoomPage.gameHeader).toHaveText(
    GAME_NAME,
  );
  await expect(secondPlayerPages.waitingRoomPage.gameHeader).toHaveText(
    GAME_NAME,
  );
});
