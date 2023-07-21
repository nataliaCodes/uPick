const express = require('express');
const cookieSession = require('cookie-session');
const router = express.Router();

router.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

module.exports = (db) => {
  //queries db for all movies of given user
  const selectUserMovies = (userId) => {
    const queryString = `
      SELECT movies.id, 
            movies.title, 
            movies.rating, 
            movies.synopsis, 
            users_movies.is_done
      FROM users
      JOIN users_movies ON users_movies.user_id = users.id
      JOIN movies ON users_movies.movie_id = movies.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  };

  //queries db for all restaurants of given user
  const selectUserRestaurants = (userId) => {
    const queryString = `
      SELECT restaurants.id, 
            restaurants.name, 
            restaurants.rating, 
            restaurants.country, 
            restaurants.street, 
            restaurants.city, 
            restaurants.province, 
            restaurants.post_code,
            users_restaurants.is_done
      FROM users
      JOIN users_restaurants ON users_restaurants.user_id = users.id
      JOIN restaurants ON users_restaurants.restaurant_id = restaurants.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  };

  //queries db for all books of given user
  const selectUserBooks = (userId) => {
    const queryString = `
	    SELECT books.id, 
             books.title, 
             books.author, 
             books.rating, 
             books.synopsis,
             users_books.is_done
      FROM users
      JOIN users_books ON users_books.user_id = users.id
	    JOIN books ON users_books.book_id = books.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  };

  //queries db for all products of given user
  const selectUserProducts = (userId) => {
    const queryString = `
      SELECT products.id, 
             products.name, 
             products.rating, 
             products.price,
             users_products.is_done
      FROM users
      JOIN users_products ON users_products.user_id = users.id
      JOIN products ON users_products.product_id = products.id
      WHERE users.id = $1
    `;
    const values = [userId];
    return db.query(queryString, values)
      .then(res => {
        // console.log(res.rows);
        return res.rows;
      })
      .catch(e => res.send(e));
  };

  // Gets all categories list
  router.get("/", (req, res) => {
    //get user id from cookie
    const userId = req.session.user_id;

    //sends all query results to the browser at the same time
    Promise.all([selectUserMovies(userId), selectUserRestaurants(userId), selectUserBooks(userId), selectUserProducts(userId)])
      .then(result => {
        //result is an array of arrays that gets sent to AJAX call
        res.send(result);
      })
      .catch(e => res.send(e));

  });

  //use this if adding delete button
  const deleteCategoryItem = (category, itemId) => {
    const queryString = `
    DELETE FROM users_${category[0]}
    WHERE  ${category[1]} = ${itemId}
    RETURNING *
    `;
    return db.query(queryString)
      .then(res => res.rows)
      .catch(e => res.send(`Error: ${e}`));
  }

  //make update call to database
  const updateItem = (table, title, id, info) => {
    let queryString;

    // account for differences in database tables
    switch (table) {
      case ('movies'):
      case ('books'):
        queryString = `
          UPDATE ${table}
          SET title='${title}', synopsis='${info}'
          WHERE id=${id}
        `;
        console.log('queryString :', queryString);
        break;
      //addresses are composed from different db columns
      case ('restaurants'):
        const addressParts = info.split(",");
        const [street, city, province, post_code, country] = addressParts;

        queryString = `
          UPDATE ${table}
          SET name='${title}', 
              country='${country.trim()}', 
              street='${street.trim()}', 
              city='${city.trim()}', 
              province='${province.trim()}', 
              post_code='${post_code.trim()}'
          WHERE id=${id}
        `;
        break;
      //prices are displayed with currency sign in front, as strings - concert to number before comitting to db
      case ('products'):
        const price = parseFloat(info.trim()).toFixed(2);
        console.log('price :', price);
        queryString = `
          UPDATE ${table}
          SET name='${title}', price='${parseInt(price * 100)}'
          WHERE id=${id}
        `;
        break;
    };

    return db.query(queryString)
      .then(res => res.rowCount)
      .catch(e => console.log('Error submitting item', e));
  };

  //called when pressing edit button on an item from any category
  router.post("/", (req, res) => {
    const table = req.body.category.toLowerCase();
    const title = req.body.itemName.includes("'") ? req.body.itemName.replace("'", "''") : req.body.itemName;
    const id = req.body.itemId;
    const info = req.body.itemInfo.includes("'") ? req.body.itemInfo.replace("'", "''") : req.body.itemInfo;

    updateItem(table, title, id, info)
      .then(updatedRows => {
        if (updatedRows == 1) {
          res.redirect("/");
        } else if (updatedRows == 0) {
          res.send("No updates made");
        } else {
          res.send("Query error");
        }
      })
  });

  return router;
};
