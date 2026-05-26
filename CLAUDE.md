---
project: unit7-game
category: 學科工具集
status: 維護中
version: "子專案文件與備份快照同步 2026-05-26"
url: https://wukolo1206.github.io/unit7-game/
next_action: 需要時再整理本機題卷與暫存輸出，不混入功能提交
updated: 2026-05-26
---

# CLAUDE.md — unit7-game

第七單元「乘法與除法」互動工具集，用純 HTML/CSS/Canvas 呈現乘除關係、倍機器、互逆與未知數活動。

## 技術框架

- 純 HTML + CSS + Canvas API + 原生 JavaScript
- 無 build 流程
- GitHub Pages 靜態部署

## 主要頁面

- `index.html`：導覽首頁
- `mul.html`：乘除關係觀察
- `machine.html`：倍機器
- `inverse.html`：乘除互逆
- `unknown.html`：找出未知數
- `divide.html`、`bridge.html`、`analyze.html`、`verify.html`、`worksheet*.html`：延伸與學習單相關頁面

## 不能動的地方

- `happy-division` 已獨立，不要再放回 `unit7-game/`。
- 學習單與題目 XML/DOCX 檔是產出與參考資料，不要任意刪除。
- `.bak` 檔是回復依據。

## 部署後驗證清單

- 開啟 `https://wukolo1206.github.io/unit7-game/`。
- 確認首頁連到 `mul.html`、`machine.html`、`inverse.html`、`unknown.html`。
- `machine.html` 可切換倍數與正反向練習。

