//
//
// Run tests
//

describe("toBeClass matcher", () => {
  it("Matches classes", () => {
    class Taco {}
    expect(Taco).toBeClass();
  });
  it("Discards non classes", () => {
    expect("Taco").not.toBeClass();
  });
});
