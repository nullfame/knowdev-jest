const matchers = require("./matchers");

const jestExpect = global.expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  // eslint-disable-next-line no-console
  console.error("Unable to find Jest's global expect.");
}
