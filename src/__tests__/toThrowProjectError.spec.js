const { InternalError, NotFoundError } = require("@knowdev/errors");

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
      it("Will match a project error to a title string", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          "Internal Application Error"
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will match a project error to a detail string", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          "An unexpected error occurred"
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match string", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          "TacoError"
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to include/i);
      });
      it("Will match a project error to a title regex", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          /Application Error/
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will match a project error to a detail regex", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          /unexpected error/
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match regex", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          /TacoError/
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to match/i);
      });
      it("Will match a project error to a project error", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          InternalError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match project error", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          NotFoundError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to be/i);
      });
      it("Works if a nonsense function is passed", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          () => {}
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError generator/i);
      });
      it("Works if a broken function is passed", () => {
        const response = toThrowProjectErrorMatching.call(
          thisNoPromise,
          functionThrowsProjectError,
          functionThrowGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError generator/i);
        expect(response.message()).toMatch(/threw/i);
      });
    });
  });
});
