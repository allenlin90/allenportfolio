const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // .isIntersecting checks if the element is visible on the screen
      entry.target.classList.toggle('show', entry.isIntersecting);
      // cancel observation after the element is shown on the screen
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  {
    // default threhold is 0
    // threshold: 0,
    // the element must be 100% shown on the screen to have the callback works
    threshold: 1,
    // the element must be 50% shown on the screen to have the callback works
    // threshold: 0.5,
    // this reduce the container element by 100px
    // rootMargin can be used to 'preload' the content before the user reaching the visible viewpoint
    // rootMargin: '-100px',
  },
);

const lastCardObserver = new IntersectionObserver(
  (entries) => {
    // we are going to access on the last element as selected
    // the 'entries' argument will always be an array
    const lastCard = entries[0];
    if (!lastCard.isIntersecting) return;
    // the following function can call to an API to fetch data
    loadNewCards();
    // cancel observe on the last card
    lastCardObserver.unobserve(lastCard.target);
    // add oberserver on the new created card
    lastCardObserver.observe(document.querySelector('.card:last-child'));
  },
  {
    // before the user reachs the end of the viewport by 100px
    // trigger the callback function
    rootMargin: '100px',
  },
);

lastCardObserver.observe(document.querySelector('.card:last-child'));

cards.forEach((card) => {
  observer.observe(card);
});

const cardContainer = document.querySelector('.card-container');

function loadNewCards() {
  // this is to pretend requesting new data from an API
  // 10 more cards will be added when the last card firstly created is shown on the screen
  for (let i = 0; i < 10; i++) {
    const card = document.createElement('div');
    card.textContent = 'New Card';
    card.classList.add('card');
    observer.observe(card);
    cardContainer.append(card);
  }
}
