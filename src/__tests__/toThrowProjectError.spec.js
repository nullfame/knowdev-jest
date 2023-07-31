const { InternalError } = require("@knowdev/errors");

const { toThrowProjectErrorMatching } = require("../matchers");

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
  describe("Allow passed values", () => {
    const thisNoPromise = { promise: undefined };
    const thisRejects = { promise: "rejects" };
    const thisResolves = { promise: "resolves" };
    const functionThrowsProjectError = () => {
      throw new InternalError();
    };
    const functionThrowGenericError = () => {
      throw new Error("Tacos");
    };
    const functionNoThrow = () => "Tacos";
    const rejectValueProjectError = new InternalError();
    const rejectValueGenericError = new Error("Tacos");
    describe("Synchronous functions", () => {
      it("Matches project errors", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Does not match non project errors", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError but caught/i);
      });
      it("Does not match successful function calls", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionNoThrow
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(
          /expected ProjectError but no error/i
        );
      });
      it("Fails if not a function", () => {
        const response = toThrowProjectErrorMatching.call(thisNoPromise, 12);
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected function but received/i);
      });
    });
    describe("Asynchronous functions", () => {
      it("Matches project errors", () => {
        const response = toThrowProjectErrorMatching.call(
          thisRejects,
          rejectValueProjectError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Does not match non project errors", () => {
        const response = toThrowProjectErrorMatching.call(
          thisRejects,
          rejectValueGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError but caught/i);
      });
      it("Does not match successful function calls", () => {
        const response = toThrowProjectErrorMatching.call(
          thisResolves,
          "Success"
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(
          /expected ProjectError but this promise/i
        );
      });
    });
    describe("Matchers", () => {
      it("Fails if anything passed is not string or regex", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          12
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected string or RegExp/i);
      });
      it.todo("Will match a project error to a string");
      it.todo("Will match a project error to a regex");
      it.todo("Will match a project error to a project error");
    });
  });
});
