import Adapter from "@cfaester/enzyme-adapter-react-18";
import "@testing-library/jest-dom";
import { configure } from "enzyme";
import "jest-location-mock";
import ResizeObserverPolyfill from "resize-observer-polyfill";

configure({ adapter: new Adapter() });

jest.mock("./socket/index", () => ({
  emit: jest.fn(),
  off: jest.fn(),
  on: jest.fn(),
}));

global.ResizeObserver = ResizeObserverPolyfill;
