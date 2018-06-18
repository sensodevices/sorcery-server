var Room = require('colyseus').Room;

class TrainingRoom extends Room {

  constructor () {
    super();

	this.playerSpawnPoints = [
		{x: -3.0, y: 0.0, z: 2.5}, {x: 3.0, y: 0.0, z: 2.5}
	];
	this.prevPlayerSpawnInd = -1;
	this.enemySpawnPoints = [
		[-3.0, 0.0, -2.5], [3.0, 0.0, -2.5], [0.0, 0.0, -2.5]
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
	let spawnPointInd = this.prevPlayerSpawnInd + 1;
	if (spawnPointInd >= this.playerSpawnPoints.length) {
		spawnPointInd = 0;
	}
	this.prevPlayerSpawnInd = spawnPointInd;
    this.state.players[client.sessionId] = this.playerSpawnPoints[spawnPointInd];
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
    //console.log("num clients:", Object.keys(this.clients).length);
    for (var sessionId in this.state.players) {
		console.log(sessionId + " x: " + this.state.players[sessionId].x);
		this.state.players[sessionId].x += 0.01;
    }
  }

  onDispose () {
    console.log("Dispose TrainingRoom");
  }

}

module.exports = TrainingRoom;
