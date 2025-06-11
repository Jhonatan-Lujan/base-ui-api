import token from '../../support/token'

class Api {
    
    constructor(baseUrl, globalHeaders = {}) {
        this.baseUrl = baseUrl
        this.globalHeaders = globalHeaders
    }

    token = null

    request(method, endpoint, options = {}) {
        const t = token.get()
        const mergedHeaders = {
            ...this.globalHeaders,
            ...(options.headers || {}),
            ...(t ? {cookie: `token=${t}`} : {})
        }
        
        return cy.api({
            method,
            url: `${this.baseUrl}${endpoint}`,
            ...options,
            headers: mergedHeaders,
            failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx responses
        })
    }

    // Metodos HTTP

    get(endpoint, options = {}) {
        return this.request('GET', endpoint, options)
    }

    post(endpoint, body, options = {}) {
        return this.request('POST', endpoint, { body, ...options })
    }

    put(endpoint, body, options = {}) {
        return this.request('PUT', endpoint, { body, ...options })
    }   

    delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, options)
    }
}

export default Api