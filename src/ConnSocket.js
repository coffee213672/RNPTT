// import { TermView } from './pttJs/term_view'
// import { TermBuf } from './pttJs/term_buf'
import { AnsiParser } from './pttJs/ansi_parser'
// import { unescapeStr, b2u, parseWaterball } from './pttJs/string_util'
import { Websocket } from './pttJs/websocket'
import { TelnetConnection } from './pttJs/telnet'
import { TermBuf } from './pttJs/term_buf'
import { DeviceEventEmitter } from 'react-native'

export function ConnectSocket(options) {
  this.buf = new TermBuf(80, 24)
  this.parser = new AnsiParser(this.buf)
}

ConnectSocket.prototype.connect = function() {
  this.connectState = 0
  this._setupWebsocketConn()
}

ConnectSocket.prototype._setupWebsocketConn = function() {
  this.wsConn = new Websocket()
  this.buf.setConn = this._attachConn(new TelnetConnection(this.wsConn))
}

ConnectSocket.prototype._attachConn = function(conn) {
  var self = this
  this.conn = conn
  this.buf.setConn(conn)
  this.conn.open = DeviceEventEmitter.once('open', this.onConnect.bind(this))
  this.conn.close = DeviceEventEmitter.addListener(
    'close',
    this.onClose.bind(this)
  )
  this.conn.data = DeviceEventEmitter.addListener('data', function(e) {
    self.onData(e.detail.data)
  })
}

ConnectSocket.prototype.onConnect = function() {
  this.conn.isConnected = true
  // this.view.setConn(this.conn)
  console.info('pttchrome onConnect')
  this.connectState = 1
  // this.updateTabIcon('connect')
  this.idleTime = 0
}

ConnectSocket.prototype.onClose = function() {
  console.info('pttchrome onClose')
  this.conn.isConnected = false
  this.connectState = 2
  this.idleTime = 0
}

ConnectSocket.prototype.onData = function(data) {
  // console.log(b2u(data))
  this.parser.feed(data)

  // parse received data for waterball
  // var wb = parseWaterball(b2u(data))
  // if (wb) {
  //   // if ('userId' in wb) {
  //   //   this.waterball.userId = wb.userId
  //   // }
  //   // if ('message' in wb) {
  //   //   this.waterball.message = wb.message
  //   // }
  //   // this.view.showWaterballNotification()
  // }
}

ConnectSocket.prototype.sendtest = function(data) {
  // console.log('wsConn test send')
  this.conn._sendRaw(data)
}
