import {
  ACCOUNT_CHANGE,
  PASSWORD_CHANGE,
  LOGIN_SUCCESS,
  LOGIN_FAILD,
  GUEST_LOGIN_FAILD,
  LOGIN_REPEAT,
} from '../actions/types'

const INITAL_STATE = {
  account: '',
  password: '',
  error: '',
  loadingEnd: false,
  loginSuccess: false,
  loginFaild: false,
  guestLoginFaild: false,
  loginRepeat: false,
}

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_CHANGE:
      return { ...state, account: action.payload }
    case PASSWORD_CHANGE:
      return { ...state, password: action.payload }
    case LOGIN_SUCCESS:
      return { ...state, loginSuccess: true, loginRepeat: false }
    case LOGIN_FAILD:
      return {
        ...state,
        loginFaild: true,
        loadingEnd: true,
        error: '帳號或密碼錯誤',
      }
    case GUEST_LOGIN_FAILD:
      return {
        ...state,
        guestLoginFaild: true,
        loadingEnd: true,
        error: '訪客登入失敗',
      }
    case LOGIN_REPEAT:
      return { ...state, loginRepeat: true }
    default:
      return state
  }
}
