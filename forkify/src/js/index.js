import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */
const state = {};

/*
Search Controller
*/
const controlSearch = async function () {
  // 1) Get query from view
  // const query = "pizza"; //TODO
  // console.log(query);
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Something wrong with the search...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

// Testing to get the recipe when page is loaded
// window.addEventListener("load", (e) => {
//   e.preventDefault();
//   controlSearch();
// });

elements.searchResultPages.addEventListener("click", function (event) {
  const btn = event.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    // console.log(goToPage);
  }
});

/*
Recipe Controller
*/
const controlRecipe = async function () {
  // Get the ID from URL
  const id = window.location.hash.replace("#", "");
  // console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe object
    state.recipe = new Recipe(id);

    // Testing to get a global variable directly
    // window.r = state.recipe;

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Error processing recipe!");
    }
  }
};

["hashchange", "load"].forEach(function (event) {
  window.addEventListener(event, controlRecipe);
});

/*
List Controller
*/
const controlList = function () {
  // Create a new list IF there is none yet
  if (!state.list) {
    state.list = new List();
  }

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(function (e) {
    const item = state.list.addItem(e.count, e.unit, e.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", function (event) {
  const id = event.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
  } else if (event.target.matches(".shopping__count-value")) {
    const val = parseInt(event.target.value);
    if (val > 0) {
      state.list.updateCount(id, val);
    }
  }
});

/*
Like Controller 
*/
// Testing purpose to check if it's working
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = function () {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    // User has liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", function (event) {
  state.likes = new Likes();

  // Restore Likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", function (event) {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    // increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
