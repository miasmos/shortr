export class Messages {
	static Link(hash, link) {
		return {
			hash: hash,
			link: link
		}
	}

	static Recaptcha(success) {
		return {
			success: success
		}
	}
}