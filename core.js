// 求值核心 — 只做算式求值,不碰 DOM(docs/adr/0001)。
// 傳統 script 形式:瀏覽器以 <script src> 載入,Node 以 require 載入。
"use strict";

function tokenize(expression) {
  const tokens = [];
  let i = 0;
  while (i < expression.length) {
    const ch = expression[i];
    if (ch === " " || ch === "\t") {
      i += 1;
      continue;
    }
    if (ch >= "0" && ch <= "9") {
      let j = i;
      while (j < expression.length && expression[j] >= "0" && expression[j] <= "9") j += 1;
      if (expression[j] === ".") {
        j += 1;
        if (!(expression[j] >= "0" && expression[j] <= "9")) {
          throw new Error("無效算式:小數點後需要數字");
        }
        while (j < expression.length && expression[j] >= "0" && expression[j] <= "9") j += 1;
      }
      tokens.push({ type: "number", value: Number(expression.slice(i, j)) });
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
