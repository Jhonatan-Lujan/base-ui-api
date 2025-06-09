class LoginPage {
    static loginPageSelectors = {
        usernameInput: '#username',
        passwordInput: '#password',
        loginButton: '#doLogin',
    }

    static visit() {
        cy.visit('/admin')
        return this
    }
    static getUsernameInput() {
        return cy.get(this.loginPageSelectors.usernameInput).should('be.visible').and('be.enabled')
    }

    static fillUsernameInput(username) {
        this.getUsernameInput().type(username)
        return this
    }
    static getPasswordInput() {
        return cy.get(this.loginPageSelectors.passwordInput).should('be.visible').and('be.enabled')
    }
    static fillPasswordInput(password) {
        this.getPasswordInput().type(password)
        return this
    }
    static getLoginButton() {
        return cy.get(this.loginPageSelectors.loginButton).should('be.visible').and('be.enabled')
    }
    static clickLoginButton() {
        this.getLoginButton().click()
        return this
    }

    static fillLoginForm(username, password) {
        this.fillUsernameInput(username)
            .fillPasswordInput(password)
            .clickLoginButton()
        return this
    }
}


export default LoginPage