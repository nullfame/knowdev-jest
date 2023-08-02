const isEqual = require("lodash.isequal");

//
//
// Helpers
//

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

const returnProjectErrorMatching = (error, ...matchers) => {
  if (error) {
    if (error.isProjectError) {
      // We know we have a ProjectError
      // Loop over the matchers and make sure they match
      for (let i = 0; i < matchers.length; i += 1) {
        const matcher = matchers[i];
        if (typeof matcher === "function") {
          const matcherError = new matcher(); // eslint-disable-line new-cap
          if (
            error.title !== matcherError.title ||
            error.status !== matcherError.status
          ) {
            return {
              pass: false,
              message: () =>
                `Expected ProjectError to be "${matcherError.title}" (${matcherError.status}) but received "${error.title}" (${error.status})`,
            };
          }
        } else if (typeof matcher === "string") {
          if (
            error.title.indexOf(matcher) === -1 &&
            error.detail.indexOf(matcher) === -1
          ) {
            return {
              pass: false,
              message: () =>
                `Expected ProjectError to include "${matcher}" but received "${error.title}" "${error.detail}"`,
            };
          }
        } else if (matcher instanceof RegExp) {
          if (!matcher.test(error.title) && !matcher.test(error.detail)) {
            return {
              pass: false,
              message: () =>
                `Expected ProjectError to match "${matcher}" but received "${error.title}" "${error.detail}"`,
            };
          }
        }
      }
      return {
        pass: true,
        message: () =>
          `Did not expect ProjectError but received "${error.title}": "${error.detail}"`,
      };
    }
    return {
      pass: false,
      message: () => `Expected ProjectError but caught "${error}"`,
    };
  }
  return {
    pass: false,
    message: () => `Expected ProjectError but no error was thrown`,
  };
};

const validateMatchers = (matchers) => {
  // Loop over the matchers and make sure they are sting or regex
  for (let i = 0; i < matchers.length; i += 1) {
    const matcher = matchers[i];
    // If it is a function, see if it response like a project error does to "new"
    if (typeof matcher === "function") {
      try {
        const matcherError = new matcher(); // eslint-disable-line new-cap
        if (!matcherError.isProjectError) {
          return {
            pass: false,
            message: () =>
              `Expected ProjectError generator but received "${matcherError}"`,
          };
        }
      } catch (error) {
        return {
          pass: false,
          message: () =>
            `Expected ProjectError generator but "${matcher}" threw "${error.name}" "${error.message}"`,
        };
      }
      // This is a valid function matcher
    }
    if (
      typeof matcher !== "function" &&
      typeof matcher !== "string" &&
      !(matcher instanceof RegExp)
    ) {
      return {
        pass: false,
        message: () => {
          const matcherType = typeof matcher;
          return `Expected string or RegExp but received "${matcher}" (${matcherType})`;
        },
      };
    }
  }
};

//
//
// Export
//

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
  // Must be function so we can use `this`
  toThrowProjectError(callbackOrPromiseReturn, ...matchers) {
    const expectation = "toThrowProjectError";
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

    const invalidMatcherResponse = validateMatchers(matchers);
    if (invalidMatcherResponse) return invalidMatcherResponse;

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

    return returnProjectErrorMatching(error, ...matchers);
  },
  // Must be function so we can use `this`
  async toThrowProjectErrorAsync(asyncFunction, ...matchers) {
    const invalidMatcherResponse = validateMatchers(matchers);
    if (invalidMatcherResponse) return invalidMatcherResponse;

    let error;
    try {
      await asyncFunction();
    } catch (e) {
      error = e;
    }

    return returnProjectErrorMatching(error, ...matchers);
  },
};
