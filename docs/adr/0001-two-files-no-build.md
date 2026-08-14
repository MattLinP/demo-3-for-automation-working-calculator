# 兩個檔案、零建置、核心與介面分離

這是個人工具，最重要的使用條件是「雙擊 `index.html` 就能用，不需要 `npm install`、不需要跑 build」。因此不採用 Vite 之類的建置工具。但求值邏輯必須能被 Node 自動化測試，而 `file://` 協定下 `<script type="module">` 會被瀏覽器以 CORS / opaque origin 擋掉，無法用 ES module 拆檔。

所以：專案是 `index.html` 加 `core.js` 兩個檔案，`core.js` 以**傳統 `<script src>`**（非 module）載入，並寫成瀏覽器與 Node 皆可載入的形式。`core.js` 只做算式求值，完全不碰 DOM；`index.html` 只做介面，不含任何求值邏輯。

看到一個沒有 `package.json`、沒有打包器的專案時，不要把它「修正」成標準前端專案——零建置是刻意的需求，不是尚未完成的技術債。
