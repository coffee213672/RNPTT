// Parser for ANSI escape sequence
import { DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { b2u } from './string_util'
import {
  LOGIN_SUCCESS,
  LOGIN_FAILD,
  GUEST_LOGIN_SUCCESS,
  GUEST_LOGIN_FAILD,
  LOGIN_REPEAT,
} from '../components/actions/types'

export function AnsiParser(termbuf) {
  this.termbuf = termbuf
  this.state = AnsiParser.STATE_TEXT
  this.esc = ''
  this.recFavDot = null
  // this.firstPage = true
  // this.getFirstData = false
}

AnsiParser.STATE_TEXT = 0
AnsiParser.STATE_ESC = 1
AnsiParser.STATE_CSI = 2
AnsiParser.STATE_C1 = 3

AnsiParser.prototype.feeds = function(data) {
  var term = this.termbuf
  if (!term) return
  var s = ''
  var n = data.length
  for (var i = 0; i < n; ++i) {
    var ch = data[i]
    switch (this.state) {
      case AnsiParser.STATE_TEXT:
        switch (ch) {
          case '\x1b':
            if (s) {
              term.puts(s)
              s = ''
            }
            this.state = AnsiParser.STATE_ESC
            break
          default:
            s += ch
        }
        break
      case AnsiParser.STATE_CSI:
        if ((ch >= '`' && ch <= 'z') || (ch >= '@' && ch <= 'Z')) {
          // if(ch != 'm')
          //    dump('CSI: ' + this.esc + ch + '\n');
          var params = this.esc.split(';')
          var firstChar = ''
          if (params[0]) {
            if (params[0].charAt(0) < '0' || params[0].charAt(0) > '9') {
              firstChar = params[0].charAt(0)
              params[0] = params[0].slice(1)
            }
          }
          if (firstChar && ch != 'h' && ch != 'l') {
            // unknown CSI
            //dump('unknown CSI: ' + this.esc + ch + '\n');
            this.state = AnsiParser.STATE_TEXT
            this.esc = ''
            break
          }
          for (var j = 0; j < params.length; ++j) {
            if (params[j]) params[j] = parseInt(params[j], 10)
            else params[j] = 0
          }
          switch (ch) {
            case 'm':
              term.assignParamsToAttrs(params)
              break
            case '@':
              term.insert(params[0] > 0 ? params[0] : 1)
              break
            case 'A':
              term.gotoPos(term.cur_x, term.cur_y - (params[0] ? params[0] : 1))
              break
            case 'B':
            case 'e':
              term.gotoPos(term.cur_x, term.cur_y + (params[0] ? params[0] : 1))
              break
            case 'C':
              // case 'e':
              term.gotoPos(term.cur_x + (params[0] ? params[0] : 1), term.cur_y)
              break
            case 'D':
              term.gotoPos(term.cur_x - (params[0] ? params[0] : 1), term.cur_y)
              break
            case 'E':
              term.gotoPos(0, term.cur_y + (params[0] ? params[0] : 1))
              break
            case 'F':
              term.gotoPos(0, term.cur_y - (params[0] ? params[0] : 1))
              break
            case 'G':
            case '`':
              term.gotoPos(params[0] > 0 ? params[0] - 1 : 0, term.cur_y)
              break
            case 'I':
              term.tab(params[0] > 0 ? params[0] : 1)
              break
            case 'd':
              term.gotoPos(term.cur_x, params[0] > 0 ? params[0] - 1 : 0)
              break
            /*
        case 'h':
          if (firstChar == '?') {
            var mainobj = term.view.conn.listener;
            switch(params[0]) {
            case 1:
              term.view.cursorAppMode = true;
              break;
            case 1048:
            case 1049:
              term.cur_x_sav = term.cur_x;
              term.cur_y_sav = term.cur_y;
              if (params[0] != 1049) break; // 1049 fall through
            case 47:
            case 1047:
              mainobj.selAll(true); // skipRedraw
              term.altScreen=mainobj.ansiCopy(true); // external buffer
              term.altScreen+=term.ansiCmp(TermChar.newChar, term.attr);
              term.clear(2);
              term.attr.resetAttr();
              break;
            default:
            }
          }
          break;
        case 'l':
          if (firstChar == '?') {
            switch (params[0]) {
            case 1:
              term.view.cursorAppMode = false;
              break;
            case 47:
            case 1047:
            case 1049:
              term.clear(2);
              term.attr.resetAttr();
              if (term.altScreen) {
                this.state = AnsiParser.STATE_TEXT;
                this.esc = '';
                this.feed(term.altScreen.replace(/(\r\n)+$/g, '\r\n'));
              }
              term.altScreen='';
              if (params[0] != 1049) break; // 1049 fall through
            case 1048:
              if (term.cur_x_sav<0 || term.cur_y_sav<0) break;
              term.cur_x = term.cur_x_sav;
              term.cur_y = term.cur_y_sav;
              break;
            default:
            }
          }
          break;
        */
            case 'J':
              term.clear(params ? params[0] : 0)
              break
            case 'H':
            case 'f':
              if (params.length < 2) {
                term.gotoPos(0, 0)
              } else {
                if (params[0] > 0) --params[0]
                if (params[1] > 0) --params[1]
                term.gotoPos(params[1], params[0])
              }
              break
            case 'K':
              term.eraseLine(params ? params[0] : 0)
              break
            case 'L':
              term.insertLine(params[0] > 0 ? params[0] : 1)
              break
            case 'M':
              term.deleteLine(params[0] > 0 ? params[0] : 1)
              break
            case 'P':
              term.del(params[0] > 0 ? params[0] : 1)
              break
            case 'r': // FIXME: scroll range
              if (params.length < 2) {
                term.scrollStart = 0
                term.scrollEnd = term.rows - 1
              } else {
                if (params[0] > 0) --params[0]
                if (params[1] > 0) --params[1]
                term.scrollStart = params[0]
                term.scrollEnd = params[1]
              }
              break
            case 's':
              term.cur_x_sav = term.cur_x
              term.cur_y_sav = term.cur_y
              break
            case 'u':
              if (term.cur_x_sav < 0 || term.cur_y_sav < 0) break
              term.cur_x = term.cur_x_sav
              term.cur_y = term.cur_y_sav
              break
            case 'S':
              term.scroll(false, params[0] > 0 ? params[0] : 1)
              break
            case 'T':
              term.scroll(true, params[0] > 0 ? params[0] : 1)
              break
            case 'X':
              term.eraseChar(params[0] > 0 ? params[0] : 1)
              break
            case 'Z':
              term.backTab(params[0] > 0 ? params[0] : 1)
              break
            default:
            //dump('unknown CSI: ' + this.esc + ch + '\n');
          }
          this.state = AnsiParser.STATE_TEXT
          this.esc = ''
        } else {
          this.esc += ch
        }
        break
      case AnsiParser.STATE_C1:
        var C1_End = true
        var C1_Char = [' ', '#', '%', '(', ')', '*', '+', '-', '.', '/']
        if (this.esc) {
          // multi-char is not supported now
          for (var j = 0; j < C1_Char.length; ++j)
            if (this.esc == C1_Char[j]) C1_End = false
          if (C1_End) --i
          else this.esc += ch
          //dump('UNKNOWN C1 CONTROL CHAR IS FOUND: ' + this.esc + '\n');
          this.esc = ''
          this.state = AnsiParser.STATE_TEXT
          break
        }
        switch (ch) {
          case '7':
            term.cur_x_sav = term.cur_x
            term.cur_y_sav = term.cur_y
            break
          case '8':
            if (term.cur_x_sav < 0 || term.cur_y_sav < 0) break
            term.cur_x = term.cur_x_sav
            term.cur_y = term.cur_y_sav
            break
          case 'D':
            term.scroll(false, 1)
            break
          case 'E':
            term.lineFeed()
            term.carriageReturn()
            break
          case 'M':
            term.scroll(true, 1)
            break
          /*
      case '=':
          term.view.keypadAppMode = true;
          break;
      case '>':
          term.view.keypadAppMode = false;
          break;
      */
          default:
            this.esc += ch
            C1_End = false
        }
        if (!C1_End) break
        this.esc = ''
        this.state = AnsiParser.STATE_TEXT
        break
      case AnsiParser.STATE_ESC:
        if (ch === '[') this.state = AnsiParser.STATE_CSI
        else {
          this.state = AnsiParser.STATE_C1
          --i
        }
        break
      default:
        return
    }
  }
  if (s) {
    term.puts(s)
    s = ''
  }

  term.lines.forEach(element => {
    var arrayX = []
    element.forEach(element2 => {
      arrayX.push(element2.ch)
    })
    const sentence = b2u(arrayX.join(''))
    console.log(sentence)
  })
  // console.log(term.lines)
  return term.lines
}

AnsiParser.prototype.feed = function(data) {
  var term = this.termbuf
  if (!term) return
  console.log(Actions.currentScene)
  // console.log(
  //   '====================================================================='
  // )
  // console.log(b2u(data))

  // 我的最愛 進入已知板名
  // 熱門看板 只列最愛
  switch (Actions.currentScene) {
    case 'login':
      this.loginParser(data)
      break
    case '_menu':
      const lines = this.feeds(data)
      const topLocation = getLocation(lines[0])
      const bottomLocation = getLocation(lines[23])
      if (
        topLocation.indexOf('【看板列表】') !== -1 &&
        bottomLocation.indexOf('進入已知板名') !== -1
      ) {
        DeviceEventEmitter.emit(Actions.currentScene, lines.slice(3, 23))
      }
      break
    case '_HotBoard':
      const lines_h = this.feeds(data)
      const topLocation_h = getLocation(lines_h[0])
      const bottomLocation_h = getLocation(lines_h[23])
      if (
        topLocation_h.indexOf('【看板列表】') !== -1 &&
        bottomLocation_h.indexOf('只列最愛') !== -1
      ) {
        DeviceEventEmitter.emit(Actions.currentScene, lines_h.slice(3, 23))
      }
      break
    case '_Mail':
      const linesMails = this.feeds(data)
      const topLocation_m = getLocation(linesMails[0])
      const bottomLocation_m = getLocation(linesMails[23])
      if (topLocation_m.indexOf('電子郵件') !== -1) {
        this.termbuf.conn.send('r')
        this.termbuf.conn.send('\x1b[C')
      }

      if (
        topLocation_m.indexOf('郵件選單') !== -1 &&
        bottomLocation_m.indexOf('鴻雁往返') !== -1
      ) {
        const mailArray = linesMails.slice(3, 23).reverse()
        DeviceEventEmitter.emit(Actions.currentScene, mailArray)
      }
      break
    case 'boardlist':
      const lines_b = this.feeds(data)
      const topLocation_b = getLocation(lines_b[1])
      const bottomLocation_b = getLocation(lines_b[23])
      const tag = lines_b[22].map(x => x.ch).join('')
      const tag1 = lines_b[3].map(x => x.ch).join('')
      const tag2 = lines_b[13].map(x => x.ch).join('')
      if (
        topLocation_b.indexOf('離開') !== -1 &&
        bottomLocation_b.indexOf('文章選讀') !== -1
      ) {
        if (tag.indexOf('¡´') !== -1 || tag1.indexOf('¡´') !== -1) {
          setTimeout(() => {
            const sendArray = lines_b.slice(3, 23).reverse()
            DeviceEventEmitter.emit('articleList', sendArray)
          }, 0.2)
        } else if (tag2.indexOf('¡´') !== -1) {
          setTimeout(() => {
            const sendArray = lines_b.slice(3, 23).reverse()
            DeviceEventEmitter.emit('readArticle', sendArray)
          }, 0.2)
        }
      }
      break
    case 'Article':
      const lines_a = this.feeds(data)
      const bottomLocation_a = getLocation(lines_a[23])
      if (bottomLocation_a.indexOf('瀏覽') !== -1) {
        DeviceEventEmitter.emit('article', lines_a)
      }
      break
    default:
  }
}

AnsiParser.prototype.loginParser = function(data) {
  const parserData = b2u(data)
  switch (true) {
    case parserData.indexOf('請勿頻繁登入以免造成系統過度負荷') !== -1:
        this.termbuf.conn.send('\x1b[C')
      break
    case parserData.indexOf('按任意鍵繼續') !== -1:
      console.log('正確登入')
      // console.log(this.termbuf.conn)
      this.termbuf.conn.send('\x1b[C')
      this.termbuf.conn.send('\x1b[C')
      this.termbuf.conn.send('14')
      this.termbuf.conn.send('\r')
      this.termbuf.conn.send('\x1b[C')
      this.termbuf.conn.send('y')
      DeviceEventEmitter.emit('Login', LOGIN_SUCCESS)
      break
    case parserData.indexOf('密碼不對或無此帳號') !== -1:
      console.log('登入失敗')
      DeviceEventEmitter.emit('Login', LOGIN_FAILD)
      break
    case parserData.indexOf('目前已有太多 guest 在站上') !== -1:
      console.log('訪客登入失敗')
      DeviceEventEmitter.emit('Login', GUEST_LOGIN_FAILD)
      break
    case parserData.indexOf('您想刪除其他重複登入') !== -1:
      DeviceEventEmitter.emit('Login', LOGIN_REPEAT)
      console.log('重複連線')
      break
    default:
      // console.log(data.length)
      break
  }
}

const getLocation = lines => {
  const charArray = lines.map(obj => obj.ch)
  const location = b2u(charArray.join('')).trim()
  return location
}
