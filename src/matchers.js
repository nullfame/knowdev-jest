const failedMatcherReceived = (matcher, received) => () =>
  `Expectation \`${matcher}\` received "${received}"`;

const successMatcherReceived = (matcher, received) =>
  failedMatcherReceived(`not.${matcher}`, received);

module.exports = {
  toBeClass: (ExpectingClass) => {
    let pass = false;
    if (typeof ExpectingClass === "function") {
      try {
        // eslint-disable-next-line no-new
        new ExpectingClass();
        pass = true;
      } catch (e) {
        pass = false;
      }
    }

    if (pass) {
      return {
        pass,
        message: successMatcherReceived("toBeClass", ExpectingClass),
      };
    }

    return {
      pass,
      message: failedMatcherReceived("toBeClass", ExpectingClass),
    };
  },
};
