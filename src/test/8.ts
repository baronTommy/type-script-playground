// ハッシュ内変換

// 90分
// 下の別解が 最適解答だと思います 正規表現が苦手なため object を無理やりループさせています

import {main, hash} from './_8'

console.log(JSON.stringify(main(hash)));

// 別解 完全に正しいわけではないが 正規表現得意なひとなら {text: "*foo*"} こんな感じでうまくいけそう
// console.log(JSON.stringify(hash).replace(/foo/g, kageDio));
