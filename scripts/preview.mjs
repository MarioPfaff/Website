import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
const publicDirectoryPath = resolve('.output/public')
const contentTypeMap = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
}
createServer(async (request, response) => {
  try {
    let requestFilePath = resolve(
      publicDirectoryPath,
      '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    )
    if (
      requestFilePath !== publicDirectoryPath &&
      !requestFilePath.startsWith(publicDirectoryPath + sep)
    )
      throw new Error('Outside site root')
    if ((await stat(requestFilePath)).isDirectory())
      requestFilePath = resolve(requestFilePath, 'index.html')
    const responseBody = await readFile(requestFilePath)
    response.writeHead(200, {
      'Content-Type': contentTypeMap[extname(requestFilePath)] || 'application/octet-stream'
    })
    response.end(responseBody)
  } catch {
    response.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8'
    })
    response.end(
      await readFile(resolve(publicDirectoryPath, '404.html')).catch(() => 'Page not found')
    )
  }
}).listen(3000, '127.0.0.1', () => console.log('Portfolio preview: http://127.0.0.1:3000'))
