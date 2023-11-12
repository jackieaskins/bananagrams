import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";

configure({ adapter: new Adapter() });

jest.mock("./socket/index", () => ({
  emit: jest.fn(),
  off: jest.fn(),
  on: jest.fn(),
}));
