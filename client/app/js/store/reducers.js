import constants from './constants'
import {combineReducers} from 'redux'
const config = require('../config.json')

export const error = (state=false, action) => {
	switch(action.type) {
		case constants.DISPLAY_ERROR:
		case constants.CLEAR_ERROR:
			return action.payload
		default:
			return state
	}
}

export const link = (state="", action) =>
	action.type === constants.SHORTENED_LINK_SHOW ? `https://${config.url}/${action.payload}` : state

export const fetching = (state=false, action) => {
	switch(action.type) {
		case constants.REQUEST_SHORTENED_LINK_PENDING:
			return true
		case constants.REQUEST_SHORTENED_LINK:
		case constants.REQUEST_SHORTENED_LINK_CANCELLED:
			return false
		default:
			return state
	}
}

export const inputChange = (state="", action) =>
	action.type === constants.INPUT_CHANGE ? action.payload : state

export const inputDirty = (state=false, action) =>
	action.type === constants.INPUT_DIRTY ? action.payload : state

export const inputValid = (state=false, action) =>
	action.type === constants.INPUT_VALID ? action.payload : state

export const inputSubmit = (state=false, action) =>
	action.type === constants.INPUT_SUBMIT ? action.payload : state

export default combineReducers({
	error,
	link,
	fetching,
	input: combineReducers({
		inputChange,
		inputDirty,
		inputValid,
		inputSubmit
	})
})
