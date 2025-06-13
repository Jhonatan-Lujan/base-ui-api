class Menu {
	static selectorsMenu = {
		menuBar: '#navbarSupportedContent',
	}

	static menuOptions = {
		Rooms: '/admin/rooms',
		Report: '/admin/report',
		Branding: '/admin/branding',
		Messages: '/admin/message',
	}

	static getMenuBar() {
		return cy.get(this.selectorsMenu.menuBar).should('be.visible')
	}
	static clickMenuOption(option) {
		this.getMenuBar().find(`a[href="${this.menuOptions[option]}"]`).should('be.visible').click()
		return this
	}
}

export default Menu
