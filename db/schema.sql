CREATE DATABASE travel_places;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  country TEXT
 );


 ALTER TABLE locations
ADD activities TEXT;
  -- activities TEXT,

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT,
    password_digest TEXT
  );

