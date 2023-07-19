
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

  //below: posts to specific items in categories with content coming from modals
  $('#moviesModal').submit(function (event) {
    //event.preventDefault();

    const userInput = getUserInput('#moviesModal');
    console.log('userInput :', userInput);

    $.when(
      $.post(`category/movies/${userInput.id}`, userInput)
        .then((response) => {
          console.log('response :', response);
          // window.location.href = window.location.origin;
          // window.location.reload();
        }),
      // $.ajax({
      //   url: `category/movies/${userInput.id}`,
      //   method: 'DELETE',
      //   success: (response) => console.log(response),
      //   error: (e) => console.log(e)
      // })
    )
    // window.location.reload();
  })

  $('#restaurantsModal').submit(function (event) {
    // event.preventDefault();

    const userInput = getUserInput('#restaurantsModal');

    $.when(
      $.post(`category/restaurants/${userInput.id}`, userInput)
        .then((response) => {
          //comes from the server(res.send)
          // console.log(response)
        }),
      $.ajax({
        url: `category/restaurants/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })

  $('#booksModal').submit(function (event) {
    // event.preventDefault();

    const userInput = getUserInput('#booksModal');

    $.when(
      $.post(`category/books/${userInput.id}`, userInput)
        .then((response) => {
          //comes from the server(res.send)
          // console.log(response)
        }),
      $.ajax({
        url: `category/books/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })

  $('#productsModal').submit(function (event) {
    // event.preventDefault();

    const userInput = getUserInput('#productsModal');

    $.when(
      $.post(`category/products/${userInput.id}`, userInput)
        .then((response) => {
          //comes from the server(res.send)
          // console.log(response)
        }),
      $.ajax({
        url: `category/products/${userInput.id}`,
        method: 'DELETE',
        success: (response) => console.log(response),
        error: (e) => console.log(e)
      })
    )
    window.location.reload();
  })
});
