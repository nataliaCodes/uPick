-- users_movies seeds
INSERT INTO users_movies (user_id, movie_id, is_done)
VALUES
  (1, 1, TRUE),
  (1, 3, FALSE),
  (2, 2, TRUE),
  (2, 1, FALSE),
  (3, 3, TRUE),
  (3, 2, FALSE),
  (4, 1, TRUE),
  (4, 3, FALSE),
  (5, 3, TRUE),
  (5, 2, FALSE),
  (6, 2, TRUE),
  (6, 1, FALSE);

-- users_restaurants seeds
INSERT INTO users_restaurants (user_id, restaurant_id, is_done)
VALUES
  (1, 2, FALSE),
  (1, 3, TRUE),
  (2, 4, FALSE),
  (2, 1, TRUE),
  (3, 1, FALSE),
  (3, 3, TRUE),
  (4, 4, FALSE),
  (4, 3, TRUE),
  (5, 1, FALSE),
  (5, 2, TRUE),
  (6, 2, FALSE),
  (6, 4, TRUE);

-- users_books seeds
INSERT INTO users_books (user_id, book_id, is_done)
VALUES
  (1, 2, TRUE),
  (1, 3, FALSE),
  (2, 2, TRUE),
  (2, 1, FALSE),
  (3, 1, TRUE),
  (3, 3, FALSE),
  (4, 2, TRUE),
  (4, 3, FALSE),
  (5, 3, TRUE),
  (5, 1, FALSE),
  (6, 2, TRUE),
  (6, 1, FALSE);

  -- users_products seeds
INSERT INTO users_products (user_id, product_id, is_done)
VALUES
  (1, 2, TRUE),
  (1, 3, FALSE),
  (2, 2, TRUE),
  (2, 1, FALSE),
  (3, 1, TRUE),
  (3, 3, FALSE),
  (4, 2, TRUE),
  (4, 3, FALSE),
  (5, 3, TRUE),
  (5, 1, FALSE),
  (6, 2, TRUE),
  (6, 1, FALSE);
