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
};
