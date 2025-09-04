const io = require('../servers').io;
const app = require('../servers').app;
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');
const checkForOrbCollisions =
  require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions =
  require('./checkCollisions').checkForPlayerCollisions;

const orbs = [];
const settings = {
  defaultNumberOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};
const players = [];
const playersForUsers = [];
let tickTockInterval;

initGame();

io.on('connect', (socket) => {
  // a player has connected
  let player = {};
  socket.on('init', (playerObj, ackCallback) => {
    if (players.length === 0) {
      // someone is about to be added to players.
      // tick-tock - issue an event to EVERY connected socket, that is playing the game, 30 times a second
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', playersForUsers);
      }, 33);
    }

    socket.join('game'); // add socket to "game" room

    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player); // server use only
    playersForUsers.push({ playerData });

    ackCallback({ orbs, indexInPlayers: playersForUsers.length - 1 });
  });

  socket.on('tock', (data) => {
    if (!player.playerConfig) {
      return;
    }

    speed = player.playerConfig.speed;
    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < 500 && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }
    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < 500 && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }

    const capturedOrbI = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    if (capturedOrbI !== null) {
      orbs.splice(capturedOrbI, 1, new Orb(settings));

      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      };
      // emit to all sockets playing the game, the orbSwitch event
      io.to('game').emit('orbSwitch', orbData);
    }

    const absorbData = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      playersForUsers,
      socket.id
    );

    if (absorbData) {
      io.to('game').emit('playerAbsorbed', absorbData);
    }
  });

  socket.on('disconnect', () => {
    if (players.length === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
