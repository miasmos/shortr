import {instance as Enum} from '../../../../core/enums'

class Keypress {
	constructor() {
		this.keys = Enum.keys
	}

	PressedKey(e) {
		return e.keyCode || e.which || e.target.value
	}

	IsPressed(e, key) {
		return this.PressedKey(e) === key || (key in this.keys && this.PressedKey(e) === this.keys[key])
	}
}

export let instance = new Keypress()