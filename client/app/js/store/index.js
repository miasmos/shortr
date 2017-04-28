import constants from './constants'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

const consoleMessages = store => next => action => {
	if (!!action && 'type' in action) console.log(`dispatching action =>`, action.type)
	return next(action)
}

export default (initialState={}) => {
	return applyMiddleware(consoleMessages, thunk)(createStore)(rootReducer, initialState)
}



