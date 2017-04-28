import constants from './constants'
import fetch from 'whatwg-fetch'
import {instance as ShortrAPI} from '../services/ShortrAPI'

export const requestShortenedLink = (link, token) => (dispatch) => {
	dispatch({
		type: constants.REQUEST_SHORTENED_LINK_PENDING
	})

	ShortrAPI.CreateLink(link, token)
		.then(json => {
			dispatch({
				type: constants.SHORTENED_LINK_SHOW,
				payload: json.hash
			})
		})
		.catch(error => {
			displayError(error)

			dispatch({
				type: constants.REQUEST_SHORTENED_LINK_CANCELLED
			})
		})
}

export const displayError = (message) => {
	return {
		type: constants.DISPLAY_ERROR,
		payload: message
	}
}

export const clearError = () => {
	return {
		type: constants.CLEAR_ERROR
	}
}

export const showLink = (link) => {
	return {
		type: constants.SHORTENED_LINK_SHOW,
		payload: link
	}
}

export const inputSubmit = () => {
	return {
		type: constants.INPUT_SUBMIT
	}
}

export const inputDirty = () => {
	return {
		type: constants.INPUT_DIRTY
	}
}

export const inputValid = () => {
	return {
		type: constants.INPUT_VALID
	}
}

export const inputChange = (text) => {
	return {
		type: constants.INPUT_CHANGE,
		payload: text
	}
}