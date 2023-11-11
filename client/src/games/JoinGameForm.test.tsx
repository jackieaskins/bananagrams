import { shallow } from "enzyme";
import JoinGameForm from "./JoinGameForm";

jest.mock("./JoinGameFormState", () => ({
  useJoinGameForm: () => ({
    error: "error",
    isJoiningGame: true,
    onSubmit: jest.fn().mockName("onSubmit"),
    setUsername: jest.fn().mockName("setUsername"),
    username: "username",
  }),
}));

describe("<JoinGameForm />", () => {
  test("renders properly", () => {
    expect(shallow(<JoinGameForm />)).toMatchSnapshot();
  });
});
