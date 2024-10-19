// Setup Canvas
const canvas = document.getElementById('particle');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse object
const mouse = {
  x: null,
  y: null,
  radius: 100 // Radius of interaction
};

// Track mouse movement
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle class
class Particle {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    // Move particle
    this.x += this.speedX;
    this.y += this.speedY;

    // Reverse direction if particle hits edge of canvas
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      // Particle is close to the mouse, repel it
      const angle = Math.atan2(dy, dx);
      const force = (mouse.radius - distance) / mouse.radius;
      const forceX = force * Math.cos(angle);
      const forceY = force * Math.sin(angle);

      this.x -= forceX * 2; // Adjust the multiplier for stronger or weaker repulsion
      this.y -= forceY * 2;
    }
  }
}

// Create particle array
const particleArray = [];
function init() {
  particleArray.length = 0;
  const numberOfParticles = 10000;

  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 10 + 1;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    const speedX = (Math.random() * 2) - 1;
    const speedY = (Math.random() * 2) - 1;
    let green = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    let color = `rgb(255, ${green}, 0)`;

    particleArray.push(new Particle(x, y, size, color, speedX, speedY));
  }
}

// Animate particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particleArray.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

// Resize canvas when window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Initialize and start animation
init();
animate();
