import { Button } from "@chakra-ui/react";
import { shallow } from "enzyme";
import PeelButton from "./PeelButton";

describe("<PeelButton />", () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <PeelButton
        canPeel
        handlePeel={jest.fn().mockName("handlePeel")}
        peelWinsGame={false}
        {...propOverrides}
      />,
    );

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe("tooltip text", () => {
    test("gives help on how to disable button if cannot peel", () => {
      expect(
        renderComponent({ canPeel: false }).props().label.props.children,
      ).toMatch("You must have a valid connected board to peel");
    });

    test("shows win game text when can peel and peel wins game", () => {
      expect(
        renderComponent({ canPeel: true, peelWinsGame: true }).props().label
          .props.children,
      ).toBe("Win the game!");
    });

    test("shows peel description when can peel but peel does not win game", () => {
      expect(
        renderComponent({ canPeel: true, peelWinsGame: false }).props().label
          .props.children,
      ).toBe("Get a new tile and send one to everyone else");
    });
  });

  describe("button text", () => {
    test("shows bananas when peel wins game", () => {
      expect(
        renderComponent({ peelWinsGame: true }).find(Button).props().children,
      ).toBe("Bananas!");
    });

    test("shows peel when peel does not win game", () => {
      expect(
        renderComponent({ peelWinsGame: false }).find(Button).props().children,
      ).toBe("Peel!");
    });
  });

  describe("disabled state", () => {
    test("is disabled when cannot peel", () => {
      expect(
        renderComponent({ canPeel: false }).find(Button).props().isDisabled,
      ).toBe(true);
    });

    test("is not disabled when can peel", () => {
      expect(
        renderComponent({ canPeel: true }).find(Button).props().isDisabled,
      ).toBe(false);
    });
  });
});
