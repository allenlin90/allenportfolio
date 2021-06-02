import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      const recipe = result.data.recipe;
      this.title = recipe.title;
      this.author = recipe.publisher;
      this.image = recipe.image_url;
      this.url = recipe.source_url;
      this.ingredients = recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("Something went wrong :(");
    }
  }

  calcTime() {
    // Assuming that we need 15 mins for each 3 ingredients
    const numIngredients = this.ingredients.length;
    const period = Math.ceil(numIngredients / 3);
    this.time = period * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoon",
      "tablespoons",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsps",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"]; // use spread notation to extend the array
    const newIngredients = this.ingredients.map(function (item) {
      // 1) Uniform units
      let ingredient = item.toLowerCase();
      unitsLong.forEach(function (unit, index) {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // 2) Remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3) Parse ingredients into count, unit and ingredient
      const arrIngredients = ingredient.split(" ");
      const unitIndex = arrIngredients.findIndex(function (ele) {
        return units.includes(ele);
      });

      let objIngredient;
      if (unitIndex > -1) {
        // There is a unit as the result is not -1
        // E.g. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
        // E.g. 4 cups, arrCount is [4]
        const arrCount = arrIngredients.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredients[0].replace("-", "+"));
        } else {
          count = eval(arrIngredients.slice(0, unitIndex).join("+"));
        }

        objIngredient = {
          count,
          unit: arrIngredients[unitIndex],
          ingredient: arrIngredients.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIngredients[0])) {
        // There is no unit, but 1st element is number, such as 1 red onion
        objIngredient = {
          count: parseInt(arrIngredients[0]),
          unit: "",
          ingredient: arrIngredients.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is no unit and no number in 1st position
        objIngredient = {
          count: 1,
          unit: "",
          ingredient, // create a property with value of 'ingredient' in the scope directly by ES6 syntax
        };
      }

      return objIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(
      function (item) {
        item.count *= newServings / this.servings;
      }.bind(this)
    );

    this.servings = newServings;
  }
}
