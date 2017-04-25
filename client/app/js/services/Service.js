import {instance as Device} from './Device.js'
import {instance as Scroll} from './Scroll.js'
import {instance as Log} from './Log.js'
import {instance as Window} from './Window.js'
import {instance as Keyboard} from './Keyboard.js'

export default class Service {
	static Device() {
		return Device
	}

	static Scroll() {
		return Scroll
	}

	static Keyboard() {
		return Keyboard
	}

	static Log() {
		return Log
	}

	static Window() {
		return Window
	}
}