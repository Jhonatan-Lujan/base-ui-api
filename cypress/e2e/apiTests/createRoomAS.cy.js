import roomSchema from '../../schemas/room/room.json'
import auth from '../../src/api/auth/auth'
import room from '../../src/api/room/room'
import roomDataBuilder from '../../support/utils/roomDataBuilder'
import roomHelper from '../../support/utils/roomHelper'

describe('restful booker - cypress api', () => {
	it('should be able to create a room successfully as admin role with api services', () => {
		auth.login().then((loginResponse) => {
			roomHelper.getNextAvailableRoomNumber().then((newRoomName) => {
				room.createRoom(roomDataBuilder.buildRandomRoomData(newRoomName)).then((createRoomResponse) => {
					room
						.getRooms()
						.validateSchema(roomSchema)
						.then((getRoomsResponse) => {
							const roomExists = getRoomsResponse.body.rooms.some((room) => room.roomName === newRoomName)
							expect(roomExists).to.be.true
						})
				})
			})
		})
	})
})
