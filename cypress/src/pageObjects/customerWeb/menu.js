class Menu {
	static menuSelectors = {
		menuBar: '#navbarNav',
	}

	static menuLinkOptions = {
		Rooms: '/#rooms',
		Booking: '/#booking',
		Amenities: '/#amenities',
		Location: '/#location',
		Contact: '/#contact',
		Admin: '/admin',
	}

	static getMenuBar() {
		return cy.get(this.menuSelectors.menuBar).should('be.visible')
	}

	static clickMenuOption(option) {
		this.getMenuBar().find(`a[href="${this.menuLinkOptions[option]}"]`).should('be.visible').click()
		return this
	}
}

export default Menu
