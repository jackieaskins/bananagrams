import { expect } from "@playwright/test";
import {
  FIRST_BOARD_POSITION,
  FIRST_HAND_TILE_POSITION,
  TILE_SIZE,
  test,
} from "./testUtils";

function boardDestination({ x, y }: { x: number; y: number }) {
  return {
    x: FIRST_BOARD_POSITION.x + x * TILE_SIZE,
    y: FIRST_BOARD_POSITION.y + y * TILE_SIZE,
  };
}

test("tutorial", async ({ page, gamePage, baseURL }) => {
  async function expectStep(stepNumber: number) {
    await expect(page.getByText("Tutorial step")).toContainText(
      `${stepNumber} / 7`,
    );
  }

  await page.goto("/");
  await page.getByRole("link", { name: "I'd love to!" }).click();
  await expect(page).toHaveURL(`${baseURL}/tutorial`);

  //------------------------------------------------------------------//
  //                     Welcome to Bananagrams!                      //
  //------------------------------------------------------------------//
  await expectStep(1);
  await page.getByRole("button", { name: "Show me how" }).click();

  //------------------------------------------------------------------//
  //                         Move first tile                          //
  //------------------------------------------------------------------//
  await expectStep(2);
  await gamePage.dragTile(
    FIRST_HAND_TILE_POSITION,
    boardDestination({ x: 0, y: 0 }),
  );

  //------------------------------------------------------------------//
  //                         Board validation                         //
  //------------------------------------------------------------------//
  await expectStep(3);
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    boardDestination({ x: 1, y: 0 }),
  );

  //------------------------------------------------------------------//
  //                            First peel                            //
  //------------------------------------------------------------------//
  await expectStep(4);
  await gamePage.peelButton.click();

  //------------------------------------------------------------------//
  //                           Dump a tile                            //
  //------------------------------------------------------------------//
  await expectStep(5);
  await gamePage.dumpTileDrag(FIRST_HAND_TILE_POSITION);

  //------------------------------------------------------------------//
  //                      Miscellaneous actions                       //
  //------------------------------------------------------------------//
  await expectStep(6);
  // TODO: Interact with sidebar and check for off-scren indicators
  await page.getByRole("button", { name: "Okay, I'm ready to win" }).click();

  //------------------------------------------------------------------//
  //                           Time to win                            //
  //------------------------------------------------------------------//
  await expectStep(7);
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    boardDestination({ x: 0, y: 1 }),
  );
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    boardDestination({ x: 0, y: 2 }),
  );
  await gamePage.clickAndMoveTile(
    FIRST_HAND_TILE_POSITION,
    boardDestination({ x: 0, y: 3 }),
  );
  await gamePage.bananasButton.click();

  //------------------------------------------------------------------//
  //                    Tutorial complete modal                    //
  //------------------------------------------------------------------//
  await page.getByRole("link", { name: "Take me home" }).click();
  await expect(page).toHaveURL(baseURL ?? "");
});
