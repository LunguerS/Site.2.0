const container = document.getElementById('cube-container');
const cubes = [];
const cubeSize = 80;
const friction = 0.98;
function getRandomColor() {
  const colors = ['#7b2cff', '#9d4edd', '#5a189a', '#c77dff', '#c084fc', '#d946ef'];
  return colors[Math.floor(Math.random() * colors.length)];
}
window.createCube = function () {
  const cube = document.createElement('div');
  cube.classList.add('cube');
  cube.style.background = getRandomColor();
  let x, y, tries = 0;
  do {
    x = Math.random() * (container.clientWidth - cubeSize);
    y = Math.random() * (container.clientHeight - cubeSize);
    tries++;
  } while (isColliding(x, y) && tries < 100);
  cube.style.left = x + 'px';
  cube.style.top = y + 'px';
  cube.vx = (Math.random() - 0.5) * 4;
  cube.vy = (Math.random() - 0.5) * 4;
  cube.angle = Math.random() * 360;
  cube.vr = (Math.random() - 0.5) * 5;
  cube.dragging = false;
  cube.lastMouseX = 0;
  cube.lastMouseY = 0;
  container.appendChild(cube);
  cubes.push(cube);
  makeDraggable(cube);
};
function isColliding(x, y) {
  for (const c of cubes) {
    const cx = parseFloat(c.style.left);
    const cy = parseFloat(c.style.top);
    if (x < cx + cubeSize && x + cubeSize > cx &&
      y < cy + cubeSize && y + cubeSize > cy) return true;
  }
  return false;
}
function makeDraggable(cube) {
  let offsetX = 0, offsetY = 0;
  function startDrag(e) {
    cube.dragging = true;
    cube.vx = 0;
    cube.vy = 0;
    cube.vr = 0;
    offsetX = e.clientX - parseFloat(cube.style.left);
    offsetY = e.clientY - parseFloat(cube.style.top);
    cube.lastMouseX = e.clientX;
    cube.lastMouseY = e.clientY;
    cube.style.cursor = 'grabbing';
  }
  function drag(e) {
    if (!cube.dragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(container.clientWidth - cubeSize, x));
    y = Math.max(0, Math.min(container.clientHeight - cubeSize, y));
    cube.vx = (e.clientX - cube.lastMouseX);
    cube.vy = (e.clientY - cube.lastMouseY);
    cube.lastMouseX = e.clientX;
    cube.lastMouseY = e.clientY;
    cube.style.left = x + 'px';
    cube.style.top = y + 'px';
    cube.angle += cube.vx * 0.2;
    cube.style.transform = `rotate(${cube.angle}deg)`;
  }
  function endDrag() {
    cube.dragging = false;
    cube.style.cursor = 'grab';
    cube.vx *= 0.5;
    cube.vy *= 0.5;
    cube.vr = (Math.random() - 0.5) * 5;
  }
  cube.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  cube.addEventListener('touchstart', e => startDrag(e.touches[0]));
  document.addEventListener('touchmove', e => drag(e.touches[0]));
  document.addEventListener('touchend', endDrag);
}
function update() {
  for (const c of cubes) {
    if (!c.dragging) {
      c.vx *= friction;
      c.vy *= friction;
      c.vr *= friction;
      let x = parseFloat(c.style.left) + c.vx;
      let y = parseFloat(c.style.top) + c.vy;
      if (x < 0 || x > container.clientWidth - cubeSize) c.vx *= -1;
      if (y < 0 || y > container.clientHeight - cubeSize) c.vy *= -1;
      x = Math.max(0, Math.min(container.clientWidth - cubeSize, x));
      y = Math.max(0, Math.min(container.clientHeight - cubeSize, y));
      c.style.left = x + 'px';
      c.style.top = y + 'px';
      c.angle += c.vr;
      c.style.transform = `rotate(${c.angle}deg)`;
    }
  }
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const a = cubes[i];
      const b = cubes[j];
      const ax = parseFloat(a.style.left);
      const ay = parseFloat(a.style.top);
      const bx = parseFloat(b.style.left);
      const by = parseFloat(b.style.top);
      if (ax < bx + cubeSize && ax + cubeSize > bx &&
        ay < by + cubeSize && ay + cubeSize > by) {
        const dx = (bx + cubeSize/2) - (ax + cubeSize/2);
        const dy = (by + cubeSize/2) - (ay + cubeSize/2);
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        const force = 2;
        if (!a.dragging) {
          a.vx -= nx * force;
          a.vy -= ny * force;
          a.vr += (Math.random() - 0.5) * 2;
        }
        if (!b.dragging) {
          b.vx += nx * force;
          b.vy += ny * force;
          b.vr += (Math.random() - 0.5) * 2;
        }
        a.style.left = ax - nx * 2 + 'px';
        a.style.top = ay - ny * 2 + 'px';
        b.style.left = bx + nx * 2 + 'px';
        b.style.top = by + ny * 2 + 'px';
      }
    }
  }
  requestAnimationFrame(update);
}
update();
