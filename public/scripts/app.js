
$(() => {
  $.ajax({
    method: "GET",
    url: "/users/api"
  }).done((users) => {
    for (user of users.users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
});

$(document).ready(() => {
  const categories = ['.movies', '.restaurants', '.books', '.products'];
  for (let category of categories) {
    //loads index with all available content for specific user - function in helpers.js
    loadCategory(category);

    //loads only clicked category(nav bar) - functions in helpers.js
    $(`#show-${category.replace('.', '')}`).click(() => {
      showCategory(category);
    })
  }
});
