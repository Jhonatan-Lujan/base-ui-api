import Api from '../core'
import token from '../../../support/token'
class Auth extends Api {
    constructor() {
        super(Cypress.env('BASE_URL_API'))
    }

    login(username = Cypress.env('ADMIN_USERNAME'), password = Cypress.env('ADMIN_PASSWORD')) {
        return this.post('auth/login', { username, password }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('token')
            token.set(response.body.token) // Store the token for future requests
            return response
        })
    }
}

export default new Auth()