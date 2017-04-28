import constants from './constants'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

export default (initialState={}) => {
	return applyMiddleware(thunk)(createStore)(rootReducer, initialState)
}



