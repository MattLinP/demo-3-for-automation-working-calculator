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

test("無效算式要說得出原因", () => {
  assert.throws(() => evaluate(""), /空白/);
  assert.throws(() => evaluate("1 +"), /突然結束/);
  assert.throws(() => evaluate("(1 + 2"), /右括號/);
  assert.throws(() => evaluate("1 $ 2"), /不認識/);
  assert.throws(() => evaluate("abc"), /不認識/);
  assert.throws(() => evaluate("1 2"), /多出/);
});

test("數字可用 _ 分隔(僅限兩個數字之間)", () => {
  assert.equal(evaluate("1_000 + 1"), 1001);
  assert.equal(evaluate("1_000_000 / 4"), 250000);
});

test("_ 分隔錯誤位置要視為無效算式", () => {
  assert.throws(() => evaluate("_100"), /不認識/);
  assert.throws(() => evaluate("100_"), /不認識/);
  assert.throws(() => evaluate("1__0"), /不認識/);
  assert.throws(() => evaluate("1_.5"), /不認識/);
  assert.throws(() => evaluate("1._5"), /小數點後需要數字/);
});
