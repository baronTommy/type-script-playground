// 普通のサーバ
// yarn ts-node src/server/a
// http://localhost:4000/
// -----------------------------------------------------------------------

// https://qiita.com/suin/items/de9f32378794de3e5867

import http, {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req)
    res.end('OK') // レスポンスボディが「OK」になる
})

server.listen(4000) // 4000番ポートで起動
