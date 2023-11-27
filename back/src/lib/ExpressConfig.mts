import express from 'express'
import http from 'http'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import SocketIOMng from '../socket/SocketIOMng.mjs'

declare global {
  var socketManager: SocketIOMng;
}

// ---------------------------------------------
// Starting our app.
// ---------------------------------------------
export const app = express()
// ---------------------------------------------
// Security
// ---------------------------------------------
app.disable('x-powered-by')
const defaultCspOptions = helmet.contentSecurityPolicy.getDefaultDirectives()
delete defaultCspOptions['upgrade-insecure-requests']
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: { ...defaultCspOptions }
  }
})
)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Credentials', 1)
  next()
})
// ---------------------------------------------
// Parsers
// ---------------------------------------------
const urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(cookieParser())
app.use(compression())
app.use(urlencodedParser)
app.use(bodyParser.json())

// ---------------------------------------------
// Create server
// ---------------------------------------------
const server = http.createServer(app)
// ---------------------------------------------
// Socket IO
// ---------------------------------------------
global.socketManager = new SocketIOMng(server);

export default server
// ---------------------------------------------
// How to Start server
// ---------------------------------------------
// const PORT = EnvSanitizer.getVar('port') as number
// server.listen(PORT, () => {
//   // test
//   console.log(`Go to https${process.env.SSL === '1' ? 's' : ''}://localhost:${PORT}/`)
// })

