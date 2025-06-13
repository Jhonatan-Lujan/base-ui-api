import { faker } from '@faker-js/faker'
import 'cypress-network-idle'

describe('restful booker - cypress ui', () => {
	it('should be able to see and read lead messages from the admin portal as admin role', () => {
		const name = faker.person.fullName()
		const email = faker.internet.email()
		const phone = faker.phone.number()
		cy.visit('')
		cy.get('[data-testid="ContactName"]').type(name)
		cy.get('[data-testid="ContactEmail"]').type(email)
		cy.get('[data-testid="ContactPhone"]').type(phone)
		cy.get('[data-testid="ContactSubject"]').type('Booking enquiry contact ASAP')
		cy.get('[data-testid="ContactDescription"]').type('This is a test message.')
		cy.contains('button', 'Submit').click()

		cy.get('#contact h3').should('contain', `Thanks for getting in touch ${name}!`)
		cy.get('#contact p').eq(0).should('contain', `We'll get back to you about`)
		cy.get('#contact p').eq(1).should('contain', 'Booking enquiry contact ASAP')
		cy.get('#contact p').eq(2).should('contain', 'as soon as possible.')
		cy.contains('a', 'Admin').click()
		cy.url().should('include', '/admin')
		cy.get('#username').type('admin')
		cy.get('#password').type('password')
		cy.contains('button', 'Login').click()
		cy.url().should('include', '/admin/rooms')

		cy.contains('a', 'Messages').click()
		cy.url().should('include', '/admin/message')

		cy.contains('p', name).click()
		cy.get("[data-testid='message']").find('p').eq(0).should('contain', name)
		cy.get("[data-testid='message']").find('p').eq(1).should('contain', phone)
		cy.get("[data-testid='message']").find('p').eq(2).should('contain', email)
		cy.get("[data-testid='message']").find('p').eq(3).should('contain', 'Booking enquiry contact ASAP')
		cy.get("[data-testid='message']").find('p').eq(4).should('contain', 'This is a test message.')
		cy.get("[data-testid='message']").find('button').contains('Close').click()
		cy.get("[data-testid='message']").should('not.exist')
	})
})
