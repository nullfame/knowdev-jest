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
  it("Does not match non project errors", () => {
    expect(() => {
      throw new Error("Tacos");
    }).not.toThrowProjectError();
  });
  it("Does not match successful function calls", () => {
    expect(() => "Tacos").not.toThrowProjectError();
  });
  it("Fails if not passed a function", () => {
    expect(
      () => {
        expect("Tacos").toThrowProjectError();
      } // eslint-disable-next-line max-len
    ).toThrow();
    expect(
      () => {
        expect("Tacos").not.toThrowProjectError();
      } // eslint-disable-next-line max-len
    ).toThrow();
  });
});
