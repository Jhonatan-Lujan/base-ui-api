class LadingPage {
    static ladingPageSelectors = {
        nameInput: '[data-testid="ContactName"]',
        emailInput: '[data-testid="ContactEmail"]',
        phoneInput: '[data-testid="ContactPhone"]',
        subjectInput: '[data-testid="ContactSubject"]',
        messageInput: '[data-testid="ContactDescription"]',
        submitButton: 'button:contains("Submit")',
        successContainer: '#contact',
    }

    static visit() {
        cy.visit('/')
        return this 
    }

    static getNameInput(){
        return cy.get(this.ladingPageSelectors.nameInput).should('be.visible').and('be.enabled')
    }

    static fillNameInput(name) {
        this.getNameInput().type(name)
        return this
    }

    static getEmailInput(){
        return cy.get(this.ladingPageSelectors.emailInput).should('be.visible').and('be.enabled')
    }

    static fillEmailInput(email) {
        this.getEmailInput().type(email)
        return this
    }

    static getPhoneInput(){
        return cy.get(this.ladingPageSelectors.phoneInput).should('be.visible').and('be.enabled')
    }

    static fillPhoneInput(phone) {
        this.getPhoneInput().type(phone)
        return this
    }
    /**
     * Gets the subject input field.
     * @returns {Cypress.Chainable} The subject input field.
     */

    static getSubjectInput(){
        return cy.get(this.ladingPageSelectors.subjectInput).should('be.visible').and('be.enabled')
    }

    static fillSubjectInput(subject) {
        this.getSubjectInput().type(subject)
        return this
    }
    /**
     * Gets the message input field.
     * @returns {Cypress.Chainable} The message input field.
     */

    static getMessageInput(){
        return cy.get(this.ladingPageSelectors.messageInput).should('be.visible').and('be.enabled')
    }

    static fillMessageInput(message) {
        this.getMessageInput().type(message)
        return this
    }
    /**
     * Gets the submit button.
     * @returns {Cypress.Chainable} The submit button.
     */

    static getSubmitButton(){
        return cy.get(this.ladingPageSelectors.submitButton).should('be.visible').and('be.enabled')
    }

    static clickSubmitButton() {
        this.getSubmitButton().click()
        return this
    }

    /**
     * Fills the contact form with the provided details.
     * @param {string} name - The name of the contact.
     * @param {string} email - The email address of the contact.
     * @param {string} phone - The phone number of the contact.
     * @param {string} subject - The subject of the message.
     * @param {string} message - The message content.
     */

    static fillContactForm(name, email, phone, subject, message) {
        this.fillNameInput(name)
        this.fillEmailInput(email)
        this.fillPhoneInput(phone)
        this.fillSubjectInput(subject)
        this.fillMessageInput(message)
        this.clickSubmitButton()
        return this
    }

    static verifySubmissionSuccess(name, subject) {
        cy.get(this.ladingPageSelectors.successContainer)
            .should('be.visible')
            .and('contain', `Thanks for getting in touch ${name}!`)
            .and('contain', `We'll get back to you about`)
            .and('contain', `${subject}`)
            .and('contain', 'as soon as possible.')
        return this
    }
}

export default LadingPage