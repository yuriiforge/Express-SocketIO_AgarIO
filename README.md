# Agar.IO Clone

A multiplayer Agar.IO-style game built with Node.js, Socket.IO, and HTML5 Canvas. Players control a cell that moves around the board, eats orbs, and can absorb other players to grow bigger and climb the leaderboard.

## 🎮 Features

- Real-time multiplayer with Socket.IO
- Smooth camera centering on the player
- Orbs randomly spawned on the map (regenerated when eaten)
- Player movement with mouse (vector calculation based on cursor position)
- Collisions:
  - Eat orbs to increase score and size
  - Absorb smaller players to grow larger
- Live leaderboard updates
- Player score HUD
- Game messages for events (absorbs, orb respawn, etc.)

## 🚀 Getting Started

1. Clone the repository

2. Install dependencies

```bash
npm install
```

3. Run the server

```bash
node index.js
```
