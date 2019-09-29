// リバースプロキシ
// yarn ts-node src/server/b
// http://localhost:8000/

// ポート8000番でリバースプロキシがHTTPリクエストを受け付け
// それをポート4000番のHTTPサーバに送信、
// HTTPサーバからレスポンスが返ってきたら、
// それをリバースプロキシがクライアントに渡す処理。
// -----------------------------------------------------------------------

// https://qiita.com/suin/items/8d0be8bee5d3b47f0ebd

import http, {IncomingMessage, ServerResponse} from 'http'

const serverPort = 4000

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req)
    res.end('OK') // レスポンスボディが「OK」になる
})
server.listen(serverPort)


// リバースプロキシ
const reverseProxy = http.createServer((requestFromClient: IncomingMessage, responseToClient: ServerResponse) => {
    const options = {
        hostname: '127.0.0.1',
        port: serverPort,
        path: requestFromClient.url,
        method: requestFromClient.method,
        headers: requestFromClient.headers,
    }

    const requestToServer = http.request(options, (responseFromServer: IncomingMessage) => {
        responseToClient.setHeader('X-Proxy', 'Node.js Proxy')
        responseToClient.writeHead(responseFromServer.statusCode || 500, responseFromServer.headers)
        responseFromServer.pipe(responseToClient, {end: true})
    })

    requestFromClient.pipe(requestToServer, {end: true})
})

reverseProxy.listen(8000)
