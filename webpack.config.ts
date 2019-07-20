import webpack from "webpack";
import path from "path";

const rules: webpack.RuleSetRule[] = [
  {
    // 拡張子 .ts の場合
    test: /\.ts$/,
    // TypeScript をコンパイルする
    use: "babel-loader"
  }
]

//webpack.Configurationを継承したインターフェースを作って新しい書き方を強制する
const config: webpack.Configuration = {
  
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/index.ts",
  
  // 出力先
  output: {
      filename: "bundle.js",
      path: path.resolve(process.cwd() + "/dist")
  },
  
  // import 文で .ts ファイルを解決するため
  resolve: {
      extensions: [".ts"]
  },
  
  module: {
    rules
  },

};

export default config;
