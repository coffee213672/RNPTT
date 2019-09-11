import { Event } from './event'
import { DeviceEventEmitter } from 'react-native'

export function Websocket() {
  let option = {
    headers: {
      origin: 'https://term.ptt.cc',
    },
  }
  this._conn = new WebSocket('wss://ws.ptt.cc/bbs', '13', option)
  this._conn.binaryType = 'arraybuffer'

  this._conn.onopen = () => {
    // console.log('open')
    DeviceEventEmitter.emit('open')
  }

  this._conn.onmessage = e => {
    var data = new Uint8Array(e.data)
    DeviceEventEmitter.emit('data', {
      detail: {
        data: String.fromCharCode.apply(String, data),
      },
    })
  }

  this._conn.onerror = e => {
    console.log(e.message)
  }

  this._conn.onclose = e => {
    console.log(e.code, e.reason)
  }
}

Event.mixin(Websocket.prototype)

Websocket.prototype.send = function(str) {
  // XXX: move this to app.
  // because ptt seems to reponse back slowly after large
  // chunk of text is pasted, so better to split it up.
  var chunk = 1000
  for (var i = 0; i < str.length; i += chunk) {
    var chunkStr = str.substring(i, i + chunk)
    var byteArray = new Uint8Array(
      chunkStr.split('').map(function(x) {
        return x.charCodeAt(0)
      })
    )
    // console.log(byteArray.buffer)
    this._conn.send(byteArray.buffer)
  }
}

// Websocket.prototype.sendtest = function(str) {
//   this._conn.send(str)
// }

Websocket.prototype.close = function() {
  this._conn.close()
}
