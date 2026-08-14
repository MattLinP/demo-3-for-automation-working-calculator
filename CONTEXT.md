# 計算機 (Calculator)

一台個人日常使用的計算機。與作業系統內建計算機的根本差異在於：使用者計算的對象是一條**可見、可編輯的算式文字**，而不是一連串消失在狀態機裡的按鍵。

## Language

**算式 (Expression)**:
使用者輸入的一整條文字，描述一次要計算的運算。它自始至終是可見且可編輯的。
_Avoid_: 公式、算術式、輸入內容、formula

**求值 (Evaluate)**:
把一條算式轉換成單一結果的動作。
_Avoid_: 計算、運算、執行、compute、calculate

**結果 (Result)**:
一條算式求值後得到的數值。
_Avoid_: 答案、輸出、value

**紙帶 (Tape)**:
本次開啟期間，依序累積的已求值算式清單。關閉視窗即消失。
_Avoid_: 歷史、記錄、history、log

**條目 (Entry)**:
紙帶上的一筆，由一條算式與它的結果構成。沒有結果的算式不是條目。
_Avoid_: 記錄、行、item、record

**上次結果 (ans)**:
算式中可直接使用的名稱，代表紙帶最後一筆條目的結果。
_Avoid_: 前值、last、previous

## 算式的三種狀態

**即時預覽 (Preview)**:
使用者仍在編輯算式時所顯示的暫時結果。它尚未成為條目。
_Avoid_: 暫存結果、即時結果、live result

**未完成算式 (Incomplete Expression)**:
目前尚不構成合法算式，但繼續輸入仍有可能成為合法算式。未完成不是錯誤。
_Avoid_: 錯誤、不完整輸入、partial

**無效算式 (Invalid Expression)**:
無論後續如何輸入都不可能成為合法算式。
_Avoid_: 錯誤算式、壞掉的算式、bad input
