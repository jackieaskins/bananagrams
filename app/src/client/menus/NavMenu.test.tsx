import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NavMenu from "./NavMenu";
import { renderComponent } from "@/client/testUtils";

async function renderMenu(pathname = "/some-page") {
  const view = renderComponent(
    <MemoryRouter initialEntries={[pathname]}>
      <NavMenu />

      <Routes>
        <Route path={pathname} element="Current page" />
        <Route path="/" element="Home" />
        <Route path="changelog" element="Changelog" />
      </Routes>
    </MemoryRouter>,
  );

  await view.user.click(screen.getByRole("button"));

  return view;
}

describe("<NavMenu />", () => {
  it("does not link to home if on homepage", async () => {
    await renderMenu("/");

    await waitFor(() => {
      expect(screen.getByRole("menu")).not.toHaveTextContent("Return home");
    });
  });

  it("links to home if not on homepage", async () => {
    const { user } = await renderMenu("/some-page");

    await user.click(screen.getByRole("menuitem", { name: "Return home" }));

    await waitFor(() => {
      expect(screen.getByText(/^Home$/)).toBeInTheDocument();
    });
  });

  it("links to changelog", async () => {
    const { user } = await renderMenu("/some-page");

    await user.click(screen.getByRole("menuitem", { name: "View changelog" }));

    await waitFor(() => {
      expect(screen.getByText(/^Changelog$/)).toBeInTheDocument();
    });
  });

  it("links to official instructions", async () => {
    await renderMenu("/some-page");

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: "Read official instructions" }),
      ).toHaveAttribute(
        "href",
        "https://bananagrams.com/blogs/news/how-to-play-bananagrams-instructions-for-getting-started",
      );
    });
  });

  it("links to report bug", async () => {
    await renderMenu("/some-page");

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: "Report bug" }),
      ).toHaveAttribute(
        "href",
        "https://github.com/jackieaskins/bananagrams/issues/new?template=bug_report.md",
      );
    });
  });

  it("links to suggest new feature", async () => {
    await renderMenu("/some-page");

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: "Suggest new feature" }),
      ).toHaveAttribute(
        "href",
        "https://github.com/jackieaskins/bananagrams/issues/new?template=feature_request.md",
      );
    });
  });
});
