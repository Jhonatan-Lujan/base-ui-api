import room from '../../src/api/room/room'

class RoomHelper {
    static getNextAvailableRoomNumber() {
        return room.getRooms().then((response) => {
            expect(response.status).to.eq(200)
            const rooms = response.body.rooms
            if (rooms.length === 0) {
                return '101' // If no rooms exist, start with room 101
            }
            const roomNumbers = rooms.map(room => parseInt(room.roomName))
            const maxRoomNumber = Math.max(...roomNumbers)
            return (maxRoomNumber + 1).toString() // Increment the highest room number
        })
    }
}

export default RoomHelper