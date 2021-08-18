window.onload = () => {
  const buttons = document.getElementById('buttonDiv');
  buttons.addEventListener('click', () => {
    buttons.style.display = 'none';
    setTimeout(function () {
      window.print();
      setTimeout(function () {
        buttons.style.display = 'block';
      }, 300);
    }, 300);
  });
};
