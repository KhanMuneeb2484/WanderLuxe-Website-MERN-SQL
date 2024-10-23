-- Creating User table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  phone_number VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('admin', 'user'))
);

-- Creating Country table
CREATE TABLE countries (
  country_id SERIAL PRIMARY KEY,
  country_name VARCHAR(100)
);

-- Creating City table
CREATE TABLE cities (
  city_id SERIAL PRIMARY KEY,
  city_name VARCHAR(100),
  country_id INT,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Hotel table
CREATE TABLE hotels (
  hotel_id SERIAL PRIMARY KEY,
  hotel_name VARCHAR(100),
  city_id INT,
  room_type VARCHAR(50),
  price DECIMAL(10, 2),
  amenities TEXT,
  availability BOOLEAN,
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Location table
CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  location_name VARCHAR(100),
  city_id INT,
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating TourGuide table
CREATE TABLE tour_guides (
  guide_id SERIAL PRIMARY KEY,
  guide_name VARCHAR(100),
  country_id INT,
  expertise TEXT,
  rating DECIMAL(3, 2),
  per_day_charge DECIMAL(10, 2),
  availability BOOLEAN,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Package table (Weak Entity: dependent on users)
-- Composite Primary Key (user_id, package_id)
CREATE TABLE packages (
  package_id SERIAL,  -- auto-incremented, but not the primary key
  user_id INT NOT NULL,  -- Must reference a valid user
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP,
  PRIMARY KEY (user_id, package_id),  -- Composite key: package_id + user_id
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Payment table (Weak Entity: dependent on bookings)
-- Composite Primary Key (booking_id, payment_id)
CREATE TABLE payments (
  payment_id SERIAL,  -- auto-incremented, but not the primary key
  booking_id INT NOT NULL,  -- Payment is dependent on a valid booking
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  status VARCHAR(50),
  PRIMARY KEY (booking_id, payment_id),  -- Composite key: booking_id + payment_id
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Booking table (Weak Entity: dependent on users and packages)
-- Composite Primary Key (user_id, package_id, booking_id)
CREATE TABLE bookings (
  booking_id SERIAL,  -- auto-incremented, but not the primary key
  user_id INT NOT NULL,  -- Booking is dependent on a valid user
  package_id INT NOT NULL,  -- Booking is dependent on a valid package
  status VARCHAR(50),
  PRIMARY KEY (user_id, package_id, booking_id),  -- Composite key: user_id + package_id + booking_id
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(package_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Picture table (Weak Entity: dependent on locations or tour guides)
-- Composite Primary Key (location_id, guide_id, picture_id)
CREATE TABLE pictures (
  picture_id SERIAL,  -- auto-incremented, but not the primary key
  location_id INT,  -- Pictures are dependent on a valid location
  guide_id INT,     -- or on a valid tour guide
  picture_url VARCHAR(255),
  alt_text VARCHAR(255),
  PRIMARY KEY (location_id, guide_id, picture_id),  -- Composite key: location_id + guide_id + picture_id
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (guide_id) REFERENCES tour_guides(guide_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
