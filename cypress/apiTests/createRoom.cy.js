describe('restful booker - cypress api', () => {
    it('should be able to create a room successfully as admin role', () => {
        cy.api({
            method: 'POST',
            url: `api/auth/login`,
            body: {
                username: 'admin',
                password: Cypress.env('ADMIN_PASSWORD')
            }
        }).then((loginResponse) => {
            expect(loginResponse.status).to.eq(200)
            expect(loginResponse.body).to.have.property('token')

            cy.api({
                method: 'POST',
                url: `api/room`,
                headers: {
                    cookie: `token=${loginResponse.body.token}`
                },
                body: {
                    roomName:"105",
                    type:"Twin",
                    accessible:true,
                    description:"Please enter a description for this room",
                    image:"https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                    roomPrice:"300",
                    features:[
                        "WiFi",
                        "TV",
                        "Refreshments"
                    ]
                    }
            }).then((postRoomResponse) => {
                expect(postRoomResponse.status).to.eq(200)
                expect(postRoomResponse.body).to.have.property('success', true)

                cy.api({
                    method: 'GET',
                    url: `api/room`,
                    headers: {
                        cookie: `token=${loginResponse.body.token}`
                    }
                }).then((getRoomsResponse) => {
                    expect(getRoomsResponse.status).to.eq(200)
                    
                })
            })
        })
    })
})