import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders social hub login heading", () => {
  render(<App />);
  expect(screen.getByText(/socialhub/i)).toBeInTheDocument();
});
