const categories = ['.movies', '.restaurants', '.books', '.products'];

//for now only applies class, need to put in state+db
const createDoneButton = function (itemId) {
  return $('<button type="input" class="done-button">')
    .text('Done')
    .click(() => {
      console.log('Done clicked on ', itemId);
      $(`${itemId}`).addClass("gray-out");
    });
}

//edit button opens up modal
const createEditButton = function (modalHTMLId, itemName, itemId, itemInfo) {
  return $(`<button type="button" class="edit-button" data-toggle="modal" data-target="${modalHTMLId}">`)
    .text('Edit')
    .click(() => {
      $(`${modalHTMLId} .item-id`).val(itemId);
      $(`${modalHTMLId} .item-name`).val(itemName);
      $(`${modalHTMLId} .item-info`).val(itemInfo);
      console.log(`Edit button clicked for ${modalHTMLId} ${itemId}`)
    });
}

//divider line between category items - unless single or last item
const createDivider = function (itemId, itemsCount) {
  if (itemsCount <= itemId + 1) {
    return;
  };

  return $('<hr>');
}

const createCategoryDisplay = function (queryResult, category) {
  const categoryContainer = $(`${category}`);

  //displays the number of items in each category
  let itemsCount = 0;
  if (queryResult.length !== 0) {
    itemsCount += queryResult.length;
  };
  const itemCounter = $('<p class="items-count">').text(`${itemsCount} ${itemsCount > 1 ? "items" : "item"}`);

  const catTitle = category.replace(".", "");

  categoryContainer.append(`<h2>${catTitle}</h2>`);
  categoryContainer.append(itemCounter);
  let itemId = 0;

  //build each item inside category
  for (const obj of queryResult) {
    const item = $(`<article id="${catTitle.slice(0, -1)}-${itemId}">`);
    const myId = `#${catTitle.slice(0, -1)}` + `${itemId}`;
    //needed to communicate to back-end
    const id = obj.id;
    //create elements of category item
    const header = $('<header>');
    const title = $('<h3>').text(`${obj.title || obj.name}`);
    const buttonsContainer = $('<div class="buttons">');
    const rating = $('<h5>').text(`Rating: ${obj.rating}`);
    let info;
    if (obj.synopsis) {
      info = $('<p>').text(`${obj.synopsis}`);
    } else if (obj.city) {
      info = $('<p>').text(`${obj.street}, ${obj.city}, ${obj.province}, ${obj.post_code}, ${obj.country}`);
    } else if (obj.price) {
      info = $('<p>').text(`Price: $${obj.price / 100}`);
    } else {
      info = $('<p>').text('No additional information provided');
    }
    const doneButton = createDoneButton(myId);
    const editButton = createEditButton(`#${catTitle}Modal`, obj.title || obj.name, id, info.text());
    const divider = createDivider(itemId, itemsCount);

    //put all HTML elements together
    header.append(title);
    buttonsContainer.append(doneButton);
    buttonsContainer.append(editButton);
    header.append(buttonsContainer);
    item.append(header);
    item.append(rating);
    item.append(info)
    item.append(divider);
    categoryContainer.append(item);
    itemId++;
  }
  return categoryContainer;
}

//loads all existing content for specific user
const loadCategory = function (category) {
  //makes a request to the /category route, gets back an array of arrays
  $.ajax('/category', { method: 'GET' })
    .then(res => {
      //assign arrays in result to their own separate array
      const [movies, restaurants, books, products] = res;
      //object built for use in createCategoryDisplay function call below
      const catArrays = {
        '.movies': movies,
        '.restaurants': restaurants,
        '.books': books,
        '.products': products
      }
      $(`${category}`).append(createCategoryDisplay(catArrays[`${category}`], `${category}`));
    })
    .catch(err => console.log(err))
};


//loops through list of categories and toggles their visibility
const toggleCategoryDisplay = function (category) {
  for (const item of categories) {
    $(`${item}`).empty();
    if (item !== category) {
      $(`${item}`).css('display', 'none');
    } else {
      $(`${item}`).css('display', 'flex');
    }
  }
}

//functions to display specific category on nav bar click
const showCategory = function (category) {
  toggleCategoryDisplay(category);
  loadCategory(category);
}

//get user input from modal form
const getUserInput = function (modalHTMLId) {
console.log('modalHTMLId :', modalHTMLId);
  const formInput = $(`${modalHTMLId} .modalInput`).serializeArray();
  console.log('formInput :', formInput);
  const id = formInput[0].value;
  const name = formInput[1].value;
  const category = formInput[2].value;
  return { id, name, category };
};
