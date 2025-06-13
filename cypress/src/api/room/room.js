import Api from '../core';
class Room extends Api {

    constructor(){
        super(Cypress.env('BASE_URL_API')) 
    }

    createRoom(roomData) {
        return this.post('room', roomData).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('success', true)
            return response
        })
    }

    getRooms() {
        return this.get('room').then((response) => {
            expect(response.status).to.eq(200)
            return response
        })
    }

    getRoomById(roomId) {
        return this.get(`room/${roomId}`).then((response) => {
            expect(response.status).to.eq(200)
            return response
        })
    }
}

export default new Room()