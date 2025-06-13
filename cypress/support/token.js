class TokenManager {
	token = null
	set(newToken) {
		this.token = newToken
	}

	get() {
		return this.token
	}

	clear() {
		this.token = null
	}
}

export default new TokenManager()
