class Room {

    constructor(socket) {
        console.log('Room created !');
        this.players = new Array()
        this.isFull = false
        this.playerReady = 0
    }

    askForSong() {
        this.chooser = this.players[0]
        this.chooser.emit('pick', '')
        this.chooser.on('pick', (songData) => {
            this.players[0].emit('play', songData)
            this.players[1].emit('play', songData)
        })
    }

    addPlayer(socket) {
        this.players.push(socket)
        console.log('Player Added')

        if (this.players.length == 2) {
            console.log('this room is now full')
            this.isFull = true
        }
    }

    roomIsFull() {
        if (this.players.length == 2) {
            this.isFull = true
        }
        return this.isFull
    }

    setReady(socket) {
        this.playerReady += 1
        console.log('Player Ready ' + this.playerReady)
        if (this.playerReady == 2) {
            this.askForSong()
        }
    }
    
}
module.exports = Room;