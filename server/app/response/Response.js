'use strict'
import {instance as Enum} from '../../../core/enums'

export class Response {
	static Ok(res, data) {
		return this.Make(res, data, undefined)
	}

	static Error(res, error) {
		return this.Make(res, undefined, error)
	}

	static Make(res, data, error) {
		if (typeof error !== 'undefined') {
			res.status(error.code || Enum.error.code.ERROR)
				.json({
					status: error.code || Enum.error.code.ERROR,
					error: error.message || Enum.error.message.GENERIC_ERROR,
					data: {}
				})
		} else {
			res.status(Enum.error.code.OK)
				.json({
					status: Enum.error.code.OK,
					data: data
				})
		}
	}
}