//
//
// Mock Setup
//

const mockFunction = jest.fn((one, two, three) => {
  if (three) return three;
  if (two) return two;
  return one;
});

afterEach(() => {
  jest.clearAllMocks();
});

//
//
// Run tests
//

describe("toBeCalledWithInitialParams matcher", () => {
  describe("Native toHaveBeenCalledWith matcher", () => {
    it("Matches one param", () => {
      mockFunction(1);
      expect(mockFunction).toHaveBeenCalledWith(1);
    });
    it("Matches two param", () => {
      mockFunction(1, 2);
      expect(mockFunction).toHaveBeenCalledWith(1, 2);
    });
    it("Does not match single param when two passed", () => {
      mockFunction(1, 2);
      expect(mockFunction).not.toHaveBeenCalledWith(1);
    });
  });
  describe("toBeCalledWithInitialParams matcher", () => {
    it("Matches one param", () => {
      mockFunction(1);
      expect(mockFunction).toBeCalledWithInitialParams(1);
    });
    it("Matches two param", () => {
      mockFunction(1, 2);
      expect(mockFunction).toBeCalledWithInitialParams(1, 2);
    });
    it("Matches single param when two passed", () => {
      mockFunction(1, 2);
      expect(mockFunction).toBeCalledWithInitialParams(1);
    });
    it("Does not match two param when one passed", () => {
      mockFunction(1);
      expect(mockFunction).not.toBeCalledWithInitialParams(1, 2);
    });
    it("Finds a needle in a haystack", () => {
      mockFunction();
      mockFunction(12);
      mockFunction(1, 2);
      mockFunction(13);
      mockFunction(12, 13);
      expect(mockFunction).toBeCalledWithInitialParams(1, 2);
    });
    it("Does not match false positives", () => {
      mockFunction();
      mockFunction(1);
      mockFunction(2);
      mockFunction(2, 1);
      expect(mockFunction).not.toBeCalledWithInitialParams(1, 2);
    });
    it("Matches zero params!?", () => {
      mockFunction();
      expect(mockFunction).toBeCalledWithInitialParams();
    });
    it("Zero params matches anything!?", () => {
      mockFunction(1, 2, 3);
      expect(mockFunction).toBeCalledWithInitialParams();
    });
    it("Matches arrays", () => {
      mockFunction([1, 2, 3]);
      expect(mockFunction).toBeCalledWithInitialParams([1, 2, 3]);
    });
    it("Matches objects", () => {
      mockFunction({ one: 1 });
      expect(mockFunction).toBeCalledWithInitialParams({ one: 1 });
    });
  });
});
