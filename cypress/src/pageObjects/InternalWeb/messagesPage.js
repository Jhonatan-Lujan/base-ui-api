class MessagesPage {
    static selectorsMessagePage = {
        messageRow: '.row.detail',
        nameCell: '[data-testId^="message"] p',
        subjectCell: '[data-testId^="messageDescription"] p',
        deleteIcon: '[data-testid^="DeleteMessageIcon"]',
        messageModal: '[data-testid="message"]',
    }

    static getRowByName(name){
        return cy.contains(this.selectorsMessagePage.nameCell, name)
            .parents(this.selectorsMessagePage.messageRow)
            .should('be.visible')
    }

    static openMessageByName(name) {
        this.getRowByName(name).click()
        return this      
    }

    static deleteMessageByName(name) {
        this.getRowByName(name).within(() => {
            cy.get(this.selectorsMessagePage.deleteIcon)
                .should('be.visible')
                .click()
        })
        return this       
    }

    static verifyMessageDetails(name, phone, email, subject, message) {
        cy.get(this.selectorsMessagePage.messageModal)
            .should('be.visible')
            .within(() => {
                cy.get('p').eq(0).should('contain', `From: ${name}`)
                cy.get('p').eq(1).should('contain', `Phone: ${phone}`)
                cy.get('p').eq(2).should('contain', `Email: ${email}`)
                cy.get('p').eq(3).should('contain', subject)
                cy.get('p').eq(4).should('contain', message)
            })
        return this
    }

    static closeMessageModal() {
        cy.get(this.selectorsMessagePage.messageModal)
            .should('be.visible')
            .find('button:contains("Close")')
            .click()
        cy.get(this.selectorsMessagePage.messageModal).should('not.exist')
        return this
    }
                
}

export default MessagesPage