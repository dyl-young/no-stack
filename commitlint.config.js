// eslint-disable-next-line no-undef
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Temporarily disable subject-case rule
    "subject-case": [0, "never"],
  },
};
