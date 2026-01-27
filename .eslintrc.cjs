module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-hooks"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".expo/",
    ".next/",
    "build/",
    "coverage/",
    "src/generated/",
    "components/__tests__/",
  ],
};
