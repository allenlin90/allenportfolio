import { elements } from "./base";

export const getInput = function () {
  return elements.searchInput.value;
};

// clear the results of previous query
export const clearResults = function () {
  elements.searchResultList.innerHTML = "";
  elements.searchResultPages.innerHTML = "";
};

export const highlightSelected = function (id) {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach(function (item) {
    item.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};

// clear the input text bar
export const clearInput = function () {
  elements.searchInput.value = "";
};

// limit title words to be rendered in the list
export const limitRecipeTitle = function (title, limit = 17) {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce(function (acc, cur) {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = function (recipe) {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  // add the HTML to <ul> tag
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

// type: 'prev' or 'next'
const createButton = function (page, type) {
  return `
    <button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>
  `;
};

// check and show next, prev, or both buttons on the page
const renderButtons = function (page, numResults, resultPerPage) {
  // use Math.ceil() to ensure that we will have enough pages to render the list
  // If we have 45 items and show 10 items in a page, we should have 5 pages in total
  const pages = Math.ceil(numResults / resultPerPage);

  // create a "button" variable that is mutable
  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to next page, as the user is on the first page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page, as the user is on the last page
    button = createButton(page, "prev");
  }

  elements.searchResultPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = function (recipes, page = 1, resultPerPage = 10) {
  // render results of current page
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resultPerPage);
};
