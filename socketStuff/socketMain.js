const io = require('../servers').io;
const app = require('../servers').app;
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');

const orbs = [];
const settings = {
  defaultNumberOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  wordlHeight: 500,
  defaultGenericOrbSize: 5,
};

initGame();

io.on('connect', (socket) => {
  // a player has connected
  const playerName = 'Yurii';
  const playerConfig = new PlayerConfig(settings);
  const playerData = new PlayerData(playerName, settings);
  const player = new Player(socket.id, playerConfig, playerData);

  socket.emit('init', {
    // make a playerConfig object
    orbs,
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
