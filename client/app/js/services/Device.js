//determines which platform we're on, desktop/tablet/mobile/phone

class Device {
	constructor() {
		this.devices = {
			DESKTOP: 1,
			PHONE: 2,
			TABLET: 3
		}
	}
	isMobile() {
		var regex = navigator.userAgent.match(/Mobi/i)	//suggested string to use via mozilla docs
		return !!regex && regex.length ? true : false
	}

	isTablet() {
		var regex = navigator.userAgent.match(/Tablet|iPad/i)
		return !!regex && regex.length ? true : false
	}

	isPhone() {
		return !this.isTablet() && this.isMobile()
	}

	isDesktop() {
		return !this.isMobile()
	}

	type() {
		if (this.isPhone()) return this.devices.PHONE
		else if (this.isTablet()) return this.devices.TABLET
		else return this.devices.DESKTOP
	}
}

export let instance = new Device()