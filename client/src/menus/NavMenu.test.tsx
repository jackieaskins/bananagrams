import { MenuList } from "@chakra-ui/react";
import { shallow } from "enzyme";
import { useLocation } from "react-router-dom";
import NavMenu from "./NavMenu";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

function getMenuItems() {
  return shallow(<NavMenu />)
    .find(MenuList)
    .props().children;
}

describe("<NavMenu />", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ pathname: "/" });
  });
  describe("Return home link", () => {
    it("is rendered when not on homepage", () => {
      useLocation.mockReturnValue({ pathname: "/other-page" });

      expect(getMenuItems()[0].props.children[0].props).toEqual(
        expect.objectContaining({
          children: "Return home",
          to: "/",
        }),
      );
    });

    it("is not rendered on homepage", () => {
      useLocation.mockReturnValue({ pathname: "/" });

      expect(getMenuItems()[0]).toBeNull();
    });
  });

  it("renders instructions link", () => {
    expect(getMenuItems()[1].props).toEqual(
      expect.objectContaining({
        children: "Read official instructions",
        href: "https://bananagrams.com/blogs/news/how-to-play-bananagrams-instructions-for-getting-started",
      }),
    );
  });

  it("renders report bug link", () => {
    expect(getMenuItems()[3].props).toEqual(
      expect.objectContaining({
        children: "Report bug",
        href: "https://github.com/jackieaskins/bananagrams/issues/new?template=bug_report.md",
      }),
    );
  });

  it("renders new feature link", () => {
    expect(getMenuItems()[4].props).toEqual(
      expect.objectContaining({
        children: "Suggest new feature",
        href: "https://github.com/jackieaskins/bananagrams/issues/new?template=feature_request.md",
      }),
    );
  });
});
