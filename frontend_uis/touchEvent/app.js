const topHalf = document.getElementById('top-half');

topHalf.addEventListener('touchstart', (event) => {
  event.preventDefault();
  console.log('Touches', event.touches.length);
  console.log('Targets', event.targetTouches.length);
  console.log('Changed', event.changedTouches.length);

  if (event.targetTouches.length >= 2) {
    console.log('More than 2 fingers');
  }
});

document.addEventListener('click', (event) => {
  console.log('Clicked');
});

document.addEventListener('touchstart', (event) => {
  [...event.changedTouches].forEach((touch) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = `${touch.pageY}px`;
    dot.style.left = `${touch.pageX}px`;
    dot.id = touch.identifier;
    document.body.append(dot);
  });
});

document.addEventListener('touchmove', (event) => {
  [...event.changedTouches].forEach((touch) => {
    const dot = document.getElementById(touch.identifier);
    dot.style.top = `${touch.pageY}px`;
    dot.style.left = `${touch.pageX}px`;
  });
});

document.addEventListener('touchend', (event) => {
  [...event.changedTouches].forEach((touch) => {
    const dot = document.getElementById(touch.identifier);
    dot.remove();
  });
});

document.addEventListener('touchcancel', (event) => {
  [...event.changedTouches].forEach((touch) => {
    const dot = document.getElementById(touch.identifier);
    dot.remove();
  });
});
