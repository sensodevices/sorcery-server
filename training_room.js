var Room = require('colyseus').Room;

class TrainingRoom extends Room {

  constructor () {
    super();

	this.playerSpawnPoints = [
		[-3, 0, 2.5], [3, 0, 2.5]
	];
	this.prevPlayerSpawnInd = -1;
	this.enemySpawnPoints = [
		[-3, 0, -2.5], [3, 0, -2.5], [0, 0, -2.5]
	];
	this.prevEnemySpawnInd = -1;
	
    this.setState({
      players: {},
      messages: []
    });
  }

  onInit (options) {
    this.setPatchRate( 1000 / 20 );
    this.setSimulationInterval( this.update.bind(this) );

    console.log("TrainingRoom created!", options);
  }

  requestJoin (options) {
    console.log("request join!", options);
    return true;
  }

  onJoin (client) {
    console.log("client joined!", client.sessionId);
    this.state.players[client.sessionId] = { x: 0, y: 0 };
  }

  onLeave (client) {
    console.log("client left!", client.sessionId);
    delete this.state.players[client.sessionId];
  }

  onMessage (client, data) {
    console.log(data, "received from", client.sessionId);
    this.state.messages.push(client.sessionId + " sent " + data);

    this.broadcast({hello: "hello world"});
  }

  update () {
    console.log("num clients:", Object.keys(this.clients).length);
    for (var sessionId in this.state.players) {
      this.state.players[sessionId].x += 0.0001;
    }
  }

  onDispose () {
    console.log("Dispose TrainingRoom");
  }

}

module.exports = TrainingRoom;
