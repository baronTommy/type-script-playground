## 方針
- `babel-loader`で`TypeScript`をトランスパイルする。ので`ts-loader`は使用しない
- 型チェックは、`tsc`でする

## 用語

### webpack
- webpack
    - ファイルバンドリング
- webpack-cli
    - webpackをcli上で使用できるようにする。

### babel
- @babel/core
    - トランスパイラ
- @babel/preset-env
    - サポートされている環境に基づいて必要なBabelプラグインを自動で決定するライブラリ
- babel-loader
    - webpack上でbabelを使用するために必要
- @babel/preset-typescript
    - TSからJSへトランスパイル
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-object-rest-spread
TypeScriptの文法には既に含まれているけど、
今はまだpreset-envには含まれていない文法も使えるようにしておく。
preset-envに含まれる日が来たら、これらのプラグインは不要になるはず。

## webpack.config.ts 化
ts-node があれば tsもOK

## babel.config.ts 化
まだないっぽい

```bash
# 型チェック -> TSC
# トランスパイル, 
tsc && webpack
```

```bash
# ビルド時の tsconfigのパス
tsc -b  # カレントのtsconfig.jsonが読まれる

tsc -b config/dev
tsc -b config/stg

tsc -b foo.aaa.json
```

```bash
# ビルド中のログ
tsc -b --verbose

# ドライラン
tsc -b --dry

# 監視モード
tsc -b --watch
```

---
---
---

## TypeScript Tips

`typeof`  
解決済みの型を抽出する  
型クエリとも呼ぶ

## todo

コードの整理
用語の整理
タグつけて検索しやすく
