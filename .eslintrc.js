module.exports = {
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },

  env: {
    node: true,
    es6: true,
  },

  plugins: [
    "mossop",
  ],

  ignorePatterns: [
    "node_modules",
    "dist",
  ],

  extends: [
    "plugin:mossop/typescript",
  ],
};
