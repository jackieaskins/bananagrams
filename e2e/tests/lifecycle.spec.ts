import { expect } from "@playwright/test";
import { test } from "./testUtils";

const GAME_NAME = "GAME_NAME";
const USERNAME = "my_username";

const TILE_SIZE = 32;
const FIRST_HAND_TILE_POSITION = { x: 284, y: 562 };
const FIRST_BOARD_POSITION = { x: 304, y: 177 };
const SECOND_BOARD_POSITION = {
  x: FIRST_BOARD_POSITION.x + TILE_SIZE,
  y: FIRST_BOARD_POSITION.y,
};
const TRAILING_BOARD_POSITION = {
  x: SECOND_BOARD_POSITION.x + TILE_SIZE,
  y: SECOND_BOARD_POSITION.y,
};
const LEADING_BOARD_POSITION = {
  x: FIRST_BOARD_POSITION.x - TILE_SIZE,
  y: FIRST_BOARD_POSITION.y,
};

test("game lifecycle", async ({
  page,
  gamePage,
  homePage,
  waitingRoomPage,
}) => {
  //------------------------------------------------------------------//
  //                           Create game                            //
  //------------------------------------------------------------------//
  await page.goto("/redesign?isShortenedGame");
  await homePage.createGame(GAME_NAME, USERNAME);

  await expect(waitingRoomPage.gameHeader).toHaveText(GAME_NAME);

  //------------------------------------------------------------------//
  //                            Start game                            //
  //------------------------------------------------------------------//
  await waitingRoomPage.readyUpAndStartGame();

  await expect(gamePage.canvas).toBeVisible();

  //------------------------------------------------------------------//
  //                       Move tiles and peel                        //
  //------------------------------------------------------------------//
  await gamePage.dragTile(FIRST_HAND_TILE_POSITION, FIRST_BOARD_POSITION);
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    SECOND_BOARD_POSITION,
  );
  // Swap tiles if the current orientation is not valid
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (await gamePage.peelButton.isDisabled()) {
    await gamePage.dragTile(FIRST_BOARD_POSITION, SECOND_BOARD_POSITION);
  }
  await gamePage.peelButton.click();

  await expect(gamePage.bananasButton).toBeVisible();

  //------------------------------------------------------------------//
  //                     Move tiles and win game                      //
  //------------------------------------------------------------------//
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    TRAILING_BOARD_POSITION,
  );
  // Move tile from end to beginning if the current orientation is not valid
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (await gamePage.bananasButton.isDisabled()) {
    await gamePage.dragTile(TRAILING_BOARD_POSITION, LEADING_BOARD_POSITION);
  }

  await gamePage.bananasButton.click();

  await expect(
    page.getByText("Here are the boards from that round"),
  ).toBeVisible();
});
