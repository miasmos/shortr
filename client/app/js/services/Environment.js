import {instance as Enum} from '../../../../core/enums'

class Environment {
	constructor() {
		this.current = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.hostname) > -1 ? Enum.environment.DEVELOPMENT : Enum.environment.PRODUCTION
	}

	IsProduction() {
		return this.current === Enum.environment.PRODUCTION
	}

	IsDevelopment() {
		return this.current === Enum.environment.DEVELOPMENT
	}

	Environment() {
		return this.current
	}
}

export let instance = new Environment()