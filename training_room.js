var Room = require('colyseus').Room;

const SpawnEnemyEvery = 15000; 
const EnemyMaxCount = 0;
const PlayerMaxCount = 3;

class TrainingRoom extends Room {

	constructor () {
		super();

		this.playerSpawnPoints = [
			{pos: [-3.0, 0.0, -2.5], rot: [0.0, 0.0, 0.0]}, 
			{pos: [3.0, 0.0, -2.5], rot: [0.0, 0.0, 0.0]}
		];
		this.prevPlayerSpawnInd = -1;
		this.enemySpawnPoints = [
			{pos: [-3.0, 0.0, 2.5], rot: [0.0, 0.0, 0.0]},
			{pos: [3.0, 0.0, 2.5], rot: [0.0, 0.0, 0.0]},
			{pos: [0.0, 0.0, 2.5], rot: [0.0, 0.0, 0.0]}
		];
		this.prevEnemySpawnInd = -1;
		this.m_spawnTimeout = 5000;
		this.m_enemiesSpawned = 0;
		this.m_playerJoined = 0;

		this.setState({
			players: {},
			messages: [],
			enemies: {}
		});
	}

	onInit (options) 
	{
		this.setPatchRate( 1000 / 20 );
		this.setSimulationInterval( this.update.bind(this) );
		console.log("TrainingRoom created!", options);
	}

	requestJoin (options) 
	{
		console.log("request join!", options);
		if (this.m_playerJoined >= PlayerMaxCount) {
			console.log("The room is full!");
			return false;
		}
		return true;
	}

	onJoin (client) 
	{
		console.log("client joined!", client.id);
		var pl = this.getPlayerSpawnPoint();
		this.state.players[client.id] = pl;
		++this.m_playerJoined;
	}

	onLeave (client) 
	{
		//console.log("client left!", client);
		delete this.state.players[client.id];
	}

	onMessage (client, data) 
	{
		console.log(data, "received from", client.id);
		//this.state.messages.push(client.id + " sent " + data);
		data.clientId = client.id;
		for (var ind in this.clients)
		{
			if (this.clients[ind].id != client.id)
			{
				this.send(this.clients[ind], data);
			}
		}
		
	}

	update () 
	{
		this.m_spawnTimeout -= this.clock.deltaTime;
		if (this.m_spawnTimeout <= 0)
		{
			if (this.m_enemiesSpawned < EnemyMaxCount)
			{
				console.log("spawn an enemy");
				++this.m_enemiesSpawned;
				var newEnemy = this.getEnemySpawnPoint();
				newEnemy.health = 100.0;
				this.state.enemies[this.getEnemyId()] = newEnemy;
			}
			this.m_spawnTimeout = SpawnEnemyEvery;
		}
		//console.log("num clients:", Object.keys(this.clients).length);
		//for (var clientId in this.state.players) 
		//{
		//	this.state.players[clientId].pos[0] += 0.01;// = newPos;
		//}
	}

	onDispose () 
	{
		console.log("Dispose TrainingRoom");
	}

	getPlayerSpawnPoint ()
	{
		let ind = this.prevPlayerSpawnInd + 1;
		if (ind >= this.playerSpawnPoints.length) ind = 0;
		this.prevPlayerSpawnInd = ind;
		return this.playerSpawnPoints[ind];
	}
  
	getEnemySpawnPoint () 
	{
		var ind = this.prevEnemySpawnInd + 1;
		if (this.prevEnemySpawnInd >= this.enemySpawnPoints.length) ind = 0;
		this.prevEnemySpawnInd = ind;
		return this.enemySpawnPoints[ind];
	}
	
	getEnemyId () 
	{
		return Math.random().toString(16).slice(-6);
	}
}

module.exports = TrainingRoom;
