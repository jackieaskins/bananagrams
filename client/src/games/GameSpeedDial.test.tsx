import { shallow } from "enzyme";
import GameSpeedDial from "./GameSpeedDial";

jest.mock("../styles", () => ({
  useStyles: () => ({
    drawerPaper: "drawerPaper",
  }),
}));

jest.mock("./GameSpeedDialState", () => ({
  useGameSpeedDial: () => ({
    leaveGameDialogOpen: true,
    showLeaveGameDialog: jest.fn().mockName("showLeaveGameDialog"),
    handleLeaveGameCancel: jest.fn().mockName("handleLeaveGameCancel"),
  }),
}));

describe("<GameSpeedDial />", () => {
  test("renders properly", () => {
    expect(shallow(<GameSpeedDial />)).toMatchSnapshot();
  });
});
