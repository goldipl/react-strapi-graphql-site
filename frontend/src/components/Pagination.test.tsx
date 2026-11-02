import { fireEvent, render, screen } from "@testing-library/react";
import Pagination, { getPageItems } from "./Pagination";

describe("getPageItems", () => {
  it("lists every page when there are few", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses distant pages into ellipses", () => {
    expect(getPageItems(6, 12)).toEqual([1, "…", 5, 6, 7, "…", 12]);
    expect(getPageItems(1, 12)).toEqual([1, 2, "…", 12]);
    expect(getPageItems(12, 12)).toEqual([1, "…", 11, 12]);
  });
});

describe("<Pagination />", () => {
  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination page={1} pageCount={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and reports clicks", () => {
    const onChange = jest.fn();
    render(<Pagination page={2} pageCount={3} onChange={onChange} />);

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("disables previous on the first page", () => {
    render(<Pagination page={1} pageCount={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });
});
