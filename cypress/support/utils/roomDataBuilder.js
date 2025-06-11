class RoomDataBuilder {
    static roomTypes = {
        SINGLE: 'Single',
        DOUBLE: 'Double',
        TWIN: 'Twin',
        SUITE: 'Suite',
        FAMILY: 'Family',
    }
    static roomFeatures = {
        WIFI: 'WiFi',
        TV: 'TV',
        REFRESHMENTS: 'Refreshments',
        SAFE: 'Safe',
        RADIO: 'Radio',
        VIEWS: 'Views',
    }
    static roomAccessibility = {
        YES: true,
        NO: false
    }

    static getRandomElement(obj) {
        const types = Object.values(obj)
        return types[Math.floor(Math.random() * types.length)]
    }

    static getRandomRoomFeatures() {
        const features = Object.values(this.roomFeatures)
        const randomCount = Math.floor(Math.random() * features.length) + 1
        const shuffled = features.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, randomCount)
    }

    static buildRandomRoomData(roomName) {
        return {
            roomName: roomName || `Room ${Math.floor(Math.random() * 1000)}`,
            type: this.getRandomElement(this.roomTypes),
            accessible: this.getRandomElement(this.roomAccessibility),
            description: `Description for ${roomName || 'Room'}`,
            image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
            roomPrice: Math.trunc((Math.random() * 500 + 50)), // Random price between 50 and 550
            features: this.getRandomRoomFeatures()
        }
    }
}

export default RoomDataBuilder