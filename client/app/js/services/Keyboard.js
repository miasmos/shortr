import {instance as Enum} from '../../../../core/enums'

class Keypress {
	constructor() {
		this.keys = Enum.keys
	}

	PressedKey(e) {
		return e.keyCode || e.which
	}

	IsPressed(e, key) {
		return PressedKey(e) === key || (key in this.keys && PressedKey(e) === this.keys[key])
	}
}

export let instance = new Keypress()