class StringParser {
  regexToken(token) {
    return token.replace(/'/gi, "").replace(/"/gi, "").replace(/`/gi, "");
  }
}
const esprima = require("esprima");
const babylon = require("babylon");
class SourceCodeParser {
  js(sourceCode) { //esprima
    const analyzedSourceCode = esprima.tokenize(sourceCode);
    return analyzedSourceCode
      .filter(item => (item.type == 'Identifier'))
      .map(item => stringParser.regexToken(item.value));
  }
  json(sourceCode) { //esprima
    const analyzedSourceCode = esprima.tokenize(sourceCode);
    const tokens = [];
    let isSkip = false;
    let isObject = false;
    analyzedSourceCode.map(item => {
      if (item.type == "Punctuator" && item.value === "{") {
        isSkip = false;
        isObject = true;
      } else if (item.type == "Punctuator" && item.value === "}") {
        // not to do
      } else if (item.type == "Punctuator" && item.value === ":") {
        isSkip = true;
        isObject = true;
      } else if (item.type == "Punctuator" && item.value === ",") {
        isSkip = false;
      } else if (item.type == "Punctuator" && item.value === "[") {
        isSkip = true;
        isObject = false;
      } else if (item.type == "Punctuator" && item.value === "]") {
        isObject = true;
      } else if (item.type == "String" && isObject && !isSkip) {
        tokens.push(stringParser.regexToken(item.value));
      } else {
        // not to do
      }
    });
    return tokens;
  }
  jsx(sourceCode) { //babylon
    const analyzedSourceCode = babylon.parse(sourceCode, {
      sourceType: "module",
      plugins: [
        "jsx",
        "flow",
        "classProperties",
        "objectRestSpread"
      ]
    });
    return analyzedSourceCode.tokens
      .filter(item => item.type.label === "name")
      .map(item => item.value);
  }
}

const stringParser = new StringParser();
const sourceCodeParser = new SourceCodeParser();
const fs = require("fs");
class SourceCodeTokenizer {
  tokenize(fileInfo) {
    const sourceCode = fs.readFileSync(fileInfo.fullPath, 'utf8');
    if (fileInfo.ext === "js") {
      return sourceCodeParser.js(sourceCode);
    } else if (fileInfo.ext === "json") {
      return sourceCodeParser.json(sourceCode);
    } else if (fileInfo.ext === "jsx") {
      return sourceCodeParser.jsx(sourceCode);
    } else {
      return [];
    }
  };
}

const instance = new SourceCodeTokenizer();

module.exports = instance;
