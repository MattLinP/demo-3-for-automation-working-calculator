"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluate } = require("./core.js");

test("四則運算與優先序", () => {
  assert.equal(evaluate("1 + 2"), 3);
  assert.equal(evaluate("10 - 3"), 7);
  assert.equal(evaluate("2 + 3 * 4"), 14);
  assert.equal(evaluate("2 * 3 + 4"), 10);
  assert.equal(evaluate("7 / 2"), 3.5);
  assert.equal(evaluate("(1 + 2) * 3"), 9);
});

test("一元負號", () => {
  assert.equal(evaluate("-5 + 2"), -3);
  assert.equal(evaluate("3 * -2"), -6);
  assert.equal(evaluate("-(2 + 3)"), -5);
});

test("% 一律代表除以 100(docs/adr/0002)", () => {
  assert.equal(evaluate("5%"), 0.05);
  assert.equal(evaluate("1200 + 5%"), 1200.05);
  assert.equal(evaluate("50%%"), 0.005);
  assert.equal(evaluate("-5%"), -0.05);
});

test("ans 代表上次結果", () => {
  assert.equal(evaluate("ans + 1", 41), 42);
  assert.throws(() => evaluate("ans"), /目前沒有上次結果/);
});

test("sqrt(x) 平方根,參數是完整算式,可巢狀", () => {
  assert.equal(evaluate("sqrt(9)"), 3);
  assert.equal(evaluate("sqrt(1 + 3)"), 2);
  assert.equal(evaluate("sqrt(sqrt(16))"), 2);
});

test("sqrt(x) 的無效輸入", () => {
  assert.throws(() => evaluate("sqrt(-1)"), /無效算式/);
  assert.throws(() => evaluate("foo(2)"), /不認識/);
});

test("無效算式要說得出原因", () => {
  assert.throws(() => evaluate(""), /空白/);
  assert.throws(() => evaluate("1 +"), /突然結束/);
  assert.throws(() => evaluate("(1 + 2"), /右括號/);
  assert.throws(() => evaluate("1 $ 2"), /不認識/);
  assert.throws(() => evaluate("abc"), /不認識/);
  assert.throws(() => evaluate("1 2"), /多出/);
});
