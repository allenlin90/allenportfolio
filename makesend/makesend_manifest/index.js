window.onload = () => {
  const buttons = document.querySelector('#buttonDiv button');
  buttons.addEventListener('click', () => {
    const functions = document.querySelector('#functions');
    functions.style.display = 'none';
    setTimeout(function () {
      window.print();
      setTimeout(function () {
        functions.style.display = 'flex';
      }, 300);
    }, 300);
  });
};
