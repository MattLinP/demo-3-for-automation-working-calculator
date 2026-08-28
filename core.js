// 求值核心 — 只做算式求值,不碰 DOM(docs/adr/0001)。
// 傳統 script 形式:瀏覽器以 <script src> 載入,Node 以 require 載入。
"use strict";

function isDigit(ch) {
  return ch >= "0" && ch <= "9";
}

// 數字之間允許用 `_` 分隔(如 1_000),規則比照 JS 數字字面量:
// `_` 只能出現在兩個數字之間,否則視為不認識的字元(在呼叫端觸發「不認識」錯誤)。
function consumeDigitRun(expression, start) {
  let j = start;
  while (j < expression.length) {
    if (isDigit(expression[j])) {
      j += 1;
      continue;
    }
    if (expression[j] === "_" && isDigit(expression[j - 1]) && isDigit(expression[j + 1])) {
      j += 1;
      continue;
    }
    break;
  }
  return j;
}

function tokenize(expression) {
  const tokens = [];
  let i = 0;
  while (i < expression.length) {
    const ch = expression[i];
    if (ch === " " || ch === "\t") {
      i += 1;
      continue;
    }
    if (isDigit(ch)) {
      let j = consumeDigitRun(expression, i);
      if (expression[j] === ".") {
        j += 1;
        if (!isDigit(expression[j])) {
          throw new Error("無效算式:小數點後需要數字");
        }
        j = consumeDigitRun(expression, j);
      }
      tokens.push({ type: "number", value: Number(expression.slice(i, j).replace(/_/g, "")) });
      i = j;
      continue;
    }
    if (ch >= "a" && ch <= "z") {
      let j = i;
      while (j < expression.length && expression[j] >= "a" && expression[j] <= "z") j += 1;
      const word = expression.slice(i, j);
      if (word !== "ans") throw new Error("無效算式:不認識「" + word + "」");
      tokens.push({ type: "ans" });
      i = j;
      continue;
    }
    if ("+-*/%()".includes(ch)) {
      tokens.push({ type: ch });
      i += 1;
      continue;
    }
    throw new Error("無效算式:不認識「" + ch + "」");
  }
  return tokens;
}

// expr    := term (('+'|'-') term)*
// term    := unary (('*'|'/') unary)*
// unary   := '-' unary | postfix
// postfix := primary ('%')*          — `%` 一律「除以 100」(docs/adr/0002)
// primary := number | 'ans' | '(' expr ')'
function evaluate(expression, ans) {
  const tokens = tokenize(expression);
  let pos = 0;

  function peek() {
    return pos < tokens.length ? tokens[pos].type : null;
  }

  function expr() {
    let value = term();
    while (peek() === "+" || peek() === "-") {
      const op = tokens[pos].type;
      pos += 1;
      value = op === "+" ? value + term() : value - term();
    }
    return value;
  }

  function term() {
    let value = unary();
    while (peek() === "*" || peek() === "/") {
      const op = tokens[pos].type;
      pos += 1;
      value = op === "*" ? value * unary() : value / unary();
    }
    return value;
  }

  function unary() {
    if (peek() === "-") {
      pos += 1;
      return -unary();
    }
    return postfix();
  }

  function postfix() {
    let value = primary();
    while (peek() === "%") {
      pos += 1;
      value = value / 100;
    }
    return value;
  }

  function primary() {
    const token = tokens[pos];
    if (!token) throw new Error("無效算式:突然結束了");
    if (token.type === "number") {
      pos += 1;
      return token.value;
    }
    if (token.type === "ans") {
      if (ans === undefined) throw new Error("目前沒有上次結果");
      pos += 1;
      return ans;
    }
    if (token.type === "(") {
      pos += 1;
      const value = expr();
      if (peek() !== ")") throw new Error("無效算式:少了右括號");
      pos += 1;
      return value;
    }
    throw new Error("無效算式:這裡不能出現「" + token.type + "」");
  }

  if (tokens.length === 0) throw new Error("無效算式:空白");
  const result = expr();
  if (pos < tokens.length) {
    throw new Error("無效算式:多出了「" + tokens[pos].type + "」");
  }
  return result;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { evaluate };
}
