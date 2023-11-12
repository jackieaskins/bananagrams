import { IconButton } from "@mui/material";
import { shallow } from "enzyme";
import CopyToClipboard from "./CopyToClipboard";
import { useCopyToClipboard } from "./CopyToClipboardState";

jest.mock("./CopyToClipboardState", () => ({
  useCopyToClipboard: jest.fn().mockReturnValue({
    shouldShow: true,
    copyToClipboard: jest.fn(),
  }),
}));

describe("<CopyToClipboard />", () => {
  const renderComponent = () =>
    shallow(<CopyToClipboard copyText="copyText" />);

  test("renders properly when should show", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test("renders properly when should not show", () => {
    useCopyToClipboard.mockReturnValue({ shouldShow: false });

    expect(renderComponent()).toMatchSnapshot();
  });

  test("onClick calls copyToClipboard", () => {
    const mockCopyToClipboard = jest.fn();
    useCopyToClipboard.mockReturnValue({
      shouldShow: true,
      copyToClipboard: mockCopyToClipboard,
    });

    renderComponent().find(IconButton).props().onClick();

    expect(mockCopyToClipboard).toHaveBeenCalledWith("copyText");
  });
});
