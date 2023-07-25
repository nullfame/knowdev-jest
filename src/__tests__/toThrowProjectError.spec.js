const { InternalError } = require("@knowdev/errors");

//
//
// Run tests
//

describe("toThrowProjectError matcher", () => {
  it("Matches project errors", () => {
    expect(() => {
      throw new InternalError();
    }).toThrowProjectError();
  });
  it("Matches project errors from async functions", () => {
    expect(async () => {
      throw new InternalError();
    }).toThrowProjectError();
  });
  it("Does not match non project errors", () => {
    expect(() => {
      throw new Error("Tacos");
    }).not.toThrowProjectError();
  });
  it("Does not match successful function calls", () => {
    expect(() => "Tacos").not.toThrowProjectError();
  });
});
