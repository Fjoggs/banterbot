module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.(js?yarn|ts?)$",
  testPathIgnorePatterns: ["/test/cypress"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
