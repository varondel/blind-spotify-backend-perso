var room = require('./room')

class RoomUtils {

    constructor() {
        this.socketToRoom = {}
    }

    addPlayer(socket) {
        
        if (!this.rooms)
            this.rooms = new Array()
        
        if ( this.rooms.length < 1 || this.rooms[this.rooms.length - 1].roomIsFull())
            this.rooms.push(new room())

        this.rooms[this.rooms.length - 1].addPlayer(socket)
        this.socketToRoom[socket.id] = this.rooms[0]
    }

    onPlayerReady(socket) {
        this.socketToRoom[socket.id].setReady(socket)
    }

}
module.exports = RoomUtils;