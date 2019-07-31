import { Actions } from 'react-native-router-flux'
import {
  ACCOUNT_CHANGE,
  PASSWORD_CHANGE,
  LOGIN_SUCCESS,
  LOGIN_FAILD,
  GUEST_LOGIN_FAILD,
  LOGIN_REPEAT,
} from './types'

export const accountChange = text => {
  return {
    type: ACCOUNT_CHANGE,
    payload: text,
  }
}

export const passwordChanged = text => {
  return {
    type: PASSWORD_CHANGE,
    payload: text,
  }
}

export const loginUser = loginResult => {
  return dispatch => {
    // dispatch({ type: LOGIN_USER })
    switch (loginResult) {
      case LOGIN_SUCCESS:
        dispatch({ type: LOGIN_SUCCESS })
        Actions.main()
        break
      case LOGIN_FAILD:
        dispatch({ type: LOGIN_FAILD })
        break
      case GUEST_LOGIN_FAILD:
        dispatch({ type: GUEST_LOGIN_FAILD })
        break
      case LOGIN_REPEAT:
        dispatch({ type: LOGIN_REPEAT })
        break
    }
  }
}
