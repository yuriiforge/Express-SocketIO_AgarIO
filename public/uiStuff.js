let wHeight = window.innerHeight;
let wWidth = window.innerWidth;

const canvas = document.querySelector('#the-canvas');
const context = canvas.getContext('2d');

canvas.height = wHeight;
canvas.width = wWidth;

const player = {};

const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', () => {
  loginModal.show();
});

document.querySelector('.name-form').addEventListener('submit', (e) => {
  e.preventDefault();

  player.name = document.querySelector('#name-input').value;

  loginModal.hide();
  spawnModal.show();
});
