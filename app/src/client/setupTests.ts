import Adapter from "@cfaester/enzyme-adapter-react-18";
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import "jest-location-mock";
import ResizeObserverPolyfill from "resize-observer-polyfill";

configure({ adapter: new Adapter() });

jest.mock("./env");
jest.mock("./socket");

jest.mock("@formkit/auto-animate/react", () => ({
  useAutoAnimate: jest.fn().mockReturnValue([]),
}));

global.ResizeObserver = ResizeObserverPolyfill;
