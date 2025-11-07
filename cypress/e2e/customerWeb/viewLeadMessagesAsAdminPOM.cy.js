import { faker } from '@faker-js/faker'
import loginPage from '../../src/pageObjects/InternalWeb/loginPage'
import internalMenu from '../../src/pageObjects/InternalWeb/menu'
import messagesPage from '../../src/pageObjects/InternalWeb/messagesPage'
import landingPage from '../../src/pageObjects/customerWeb/landingPage'
import customerMenu from '../../src/pageObjects/customerWeb/menu'
import 'cypress-network-idle'

describe('restful booker - cypress page object model', () => {
	it('should be able to see and read lead messages from the admin portal as admin role', () => {
		const contactInformation = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			subject: 'Booking enquiry contact ASAP',
			message: 'This is a booking test message.',
		}
		landingPage
			.visit()
			.fillContactForm(
				contactInformation.name,
				contactInformation.email,
				contactInformation.phone,
				contactInformation.subject,
				contactInformation.message,
			)
			.verifySubmissionSuccess(contactInformation.name, contactInformation.subject)
		customerMenu.clickMenuOption('Admin')

		cy.url().should('include', '/admin')

		loginPage.visit().fillLoginForm(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))

		cy.url().should('include', '/admin/rooms')
		cy.waitForNetworkIdle('GET', '*.x-component', 200)
		internalMenu.clickMenuOption('Messages')
		cy.url().should('include', '/admin/message')
		messagesPage
			.openMessageByName(contactInformation.name)
			.verifyMessageDetails(
				contactInformation.name,
				contactInformation.phone,
				contactInformation.email,
				contactInformation.subject,
				contactInformation.message,
			)
			.closeMessageModal()
	})
})
