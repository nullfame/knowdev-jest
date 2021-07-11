// const matcherResponse = (pass, matcher, received, expected) => {
//   if(pass) {
//     return {
//       pass,
//       message: () => `Matcher \`not.${matcher}\` expected NOT "${expected}" but received "${received}"`,
//     }
//   }
//   return {
//     pass,
//     message: () => `Matcher \`${matcher}\` expected "${expected}" but received "${received}"`,
//   };
// }

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
