const { InternalError, NotFoundError } = require("@knowdev/errors");

const {
  toThrowProjectError,
  toThrowProjectErrorAsync,
} = require("../matchers");

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
  describe("Allow passed values", () => {
    const thisEmpty = {};
    const thisNoPromise = { promise: undefined };
    const functionThrowsProjectError = () => {
      throw new InternalError();
    };
    const functionThrowGenericError = () => {
      throw new Error("Tacos");
    };
    const asyncFunctionThrowsProjectError = async () => {
      throw new InternalError();
    };
    const asyncFunctionThrowGenericError = async () => {
      throw new Error("Tacos");
    };
    const asyncNoThrow = async () => "Tacos";
    const functionNoThrow = () => "Tacos";
    describe("Synchronous functions", () => {
      it("Matches project errors", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Does not match non project errors", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError but caught/i);
      });
      it("Does not match successful function calls", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionNoThrow
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(
          /expected ProjectError but no error/i
        );
      });
      it("Fails if not a function", () => {
        const response = toThrowProjectError.call(thisNoPromise, 12);
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected function but received/i);
      });
    });
    describe("Asynchronous functions", () => {
      it("Matches project errors", async () => {
        const response = await toThrowProjectErrorAsync.call(
          thisEmpty,
          asyncFunctionThrowsProjectError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Does not match non project errors", async () => {
        const response = await toThrowProjectErrorAsync.call(
          thisEmpty,
          asyncFunctionThrowGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError but caught/i);
      });
      it("Does not match successful function calls", async () => {
        const response = await toThrowProjectErrorAsync.call(
          thisEmpty,
          asyncNoThrow
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(
          /expected ProjectError but no error/i
        );
      });
      it("Fails if not a function", async () => {
        const response = await toThrowProjectErrorAsync.call(thisEmpty, 12);
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected function but received/i);
      });
    });
    describe("Matchers", () => {
      it("Fails if anything passed is not string or regex", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          12
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected string or RegExp/i);
      });
      it("Will match a project error to a title string", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          "Internal Application Error"
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will match a project error to a detail string", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          "An unexpected error occurred"
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match string", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          "TacoError"
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to include/i);
      });
      it("Will match a project error to a title regex", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          /Application Error/
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will match a project error to a detail regex", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          /unexpected error/
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match regex", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          /TacoError/
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to match/i);
      });
      it("Will match a project error to a project error", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          InternalError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will fail when project error doesn't match project error", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          NotFoundError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError to be/i);
      });
      it("Works if a nonsense function is passed", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          () => {}
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError generator/i);
      });
      it("Works if a broken function is passed", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          functionThrowGenericError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/expected ProjectError generator/i);
        expect(response.message()).toMatch(/threw/i);
      });
      it("Will match multiple matchers", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          "Internal Application Error",
          /unexpected error/,
          InternalError
        );
        expect(response.pass).toBe(true);
        expect(response.message()).toMatch(/did not expect ProjectError/i);
      });
      it("Will not match if even one of multiple matchers fails", () => {
        const response = toThrowProjectError.call(
          thisNoPromise,
          functionThrowsProjectError,
          "Internal Application Error",
          /unexpected error/,
          /taco town/,
          InternalError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/taco town/i);
      });
      it("Will not match if even one of multiple matchers fails", async () => {
        const response = await toThrowProjectErrorAsync.call(
          thisEmpty,
          asyncFunctionThrowsProjectError,
          "Internal Application Error",
          /unexpected error/,
          /taco town/,
          InternalError
        );
        expect(response.pass).toBe(false);
        expect(response.message()).toMatch(/taco town/i);
      });
    });
  });
});
