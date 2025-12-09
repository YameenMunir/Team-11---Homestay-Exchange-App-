import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router-dom";
import Home from "./pages/Home";

test("renders home page", async () => {
  const { getByText } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const headingText = "Making UK Education Accessible Through";
  const headingElement = getByText(headingText, { exact: false });

  await expect.element(headingElement).toBeInTheDocument();

  // Check for key features
  const safeVerified = getByText("Safe & Verified", { exact: false });
  await expect.element(safeVerified).toBeInTheDocument();
});
