DROP TABLE IF EXISTS movies CASCADE;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  rating FLOAT(2) NOT NULL DEFAULT 0,
  synopsis TEXT NOT NULL
);