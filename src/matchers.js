const { BadRequestError } = require("@knowdev/errors");
const isEqual = require("lodash.isequal");

const matcherResponseWithMessages = (pass, failMessage, failNotMessage) => {
  if (pass) {
    return {
      pass,
      message: () => failNotMessage,
    };
  }
  return {
    pass,
    message: () => failMessage,
  };
};

module.exports = {
  toBeAsyncIterator: (received) =>
    // All we do is see if this special symbol exists on `received` and is a function
    // Could we do something more sophisticated?  Maybe
    // We could see if we can iterate over it, but that may have side effects
    // This is working right now
    matcherResponseWithMessages(
      typeof received[Symbol.asyncIterator] === "function",
      `Expectation \`toBeAsyncIterator\` expected asyncIterator but received "${received}"`,
      `Expectation \`not.toBeAsyncIterator\` received asyncIterator "${received.name}"`
    ),
  toBeCalledWithInitialParams: (received, ...passed) => {
    let pass;

    received.mock.calls.forEach((call) => {
      if (call.length >= passed.length) {
        let matching = true;
        for (let i = 0; i < passed.length && matching; i += 1) {
          if (!isEqual(passed[i], call[i])) matching = false;
        }
        pass = pass || matching;
      }
    });

    if (pass === undefined) pass = false;
    return matcherResponseWithMessages(
      pass,
      `Expectation \`toBeCalledWithInitialParams\` expected call beginning with [${passed},...]`,
      `Expectation \`not.toBeCalledWithInitialParams\` did not expect call beginning with [${passed},...]`
    );
  },
  toBeClass: (received) => {
    let pass = false;
    if (typeof received === "function") {
      try {
        // eslint-disable-next-line new-cap, no-new
        new received();
        pass = true;
      } catch (e) {
        pass = false;
      }
    }
    return matcherResponseWithMessages(
      pass,
      `Expectation \`toBeClass\` expected class but received "${received}"`,
      `Expectation \`not.toBeClass\` received class "${received.name}"`
    );
  },
  toThrowProjectError: async (received) => {
    // Make sure received is an function we can invoke
    if (typeof received !== "function") {
      throw new BadRequestError(
        `Expectation \`toThrowProjectError\` expected a function but received "${received}"`
      );
    }

    // Invoke the function and see if it throws
    let pass = false;
    try {
      if (received.constructor.name === "AsyncFunction") {
        await received();
      } else {
        received();
      }
    } catch (error) {
      pass = error.isProjectError || false;
      return matcherResponseWithMessages(
        pass,
        `Expectation \`toThrowProjectError\` expected ProjectError but received "${error}"`,
        `Expectation \`not.toThrowProjectError\` received ProjectError "${error.title}" (${error.status})`
      );
    }

    return {
      pass: false,
      message: () =>
        "Expectation `toThrowProjectError` expected ProjectError but no error was thrown",
    };
  },
  // Must be function so we can use `this`
  toThrowProjectErrorMatching(callbackOrPromiseReturn, ...matchers) {
    const expectation = "toThrowProjectErrorMatching";
    const isFromResolve = this && this.promise === "resolves";
    if (isFromResolve) {
      return {
        pass: false,
        message: () =>
          `Expectation "${expectation}" expected ProjectError but this promise was resolved`,
      };
    }
    const isFromReject = this && this.promise === "rejects";
    if (
      (!callbackOrPromiseReturn ||
        typeof callbackOrPromiseReturn !== "function") &&
      !isFromReject
    ) {
      return {
        pass: false,
        message: () =>
          `Expectation "${expectation}" expected function but received "${callbackOrPromiseReturn}"`,
      };
    }

    // Loop over the matchers and make sure they are sting or regex
    for (let i = 0; i < matchers.length; i += 1) {
      const matcher = matchers[i];
      if (typeof matcher !== "string" && !(matcher instanceof RegExp)) {
        return {
          pass: false,
          message: () => {
            const matcherType = typeof matcher;
            return `Expectation "${expectation}" expected string or RegExp but received "${matcher}" (${matcherType})`;
          },
        };
      }
    }

    let error;
    if (isFromReject) {
      error = callbackOrPromiseReturn;
    } else {
      try {
        callbackOrPromiseReturn();
      } catch (e) {
        error = e;
      }
    }

    if (error) {
      if (error.isProjectError) {
        return {
          pass: true,
          message: () =>
            `Expectation "not.${expectation}" did not expect ProjectError but received "${error.title}": "${error.detail}"`,
        };
      }
      return {
        pass: false,
        message: () =>
          `Expectation "${expectation}" expected ProjectError but caught "${error}"`,
      };
    }
    return {
      pass: false,
      message: () =>
        `Expectation "${expectation}" expected ProjectError but no error was thrown`,
    };
  },
};
