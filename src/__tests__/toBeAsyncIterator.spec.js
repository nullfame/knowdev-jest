//
//
// Mock asyncIterator
//

async function* myAsyncIterator() {
  yield "Camouflage";
  yield "Sneak";
  yield "Triage";
  yield "True Strike";
}

//
//
// Run tests
//

describe("toBeAsyncIterator matcher", () => {
  it("Matches asyncIterator", () => {
    expect(myAsyncIterator()).toBeAsyncIterator();
  });
  it("Discards non asyncIterator", () => {
    class Taco {}
    expect(Taco).not.toBeAsyncIterator();
  });
});
