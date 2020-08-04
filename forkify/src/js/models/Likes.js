export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Persist data in localStorage
    this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(function (item) {
      return item.id === id;
    });
    this.likes.splice(index, 1);

    //Persis data in localStorage
    this.persistData();
  }

  // We'd like to get a boolean true or false here to know if we will add class to the liked icon to indicate that the user has "liked" the recipe.
  isLiked(id) {
    return (
      this.likes.findIndex(function (item) {
        return item.id === id;
      }) !== -1
    );
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));

    // check if localStorage has stored data and restore likes from it
    if (storage) this.likes = storage;
  }
}
