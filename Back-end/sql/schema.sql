-- Creating Country table
CREATE TABLE IF NOT EXISTS countries (
  country_id SERIAL PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL,
  country_continent TEXT NOT NULL
);

-- Creating City table
CREATE TABLE IF NOT EXISTS cities (
  city_id SERIAL PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL,
  country_id INT NOT NULL,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating User table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'user')) NOT NULL
);

-- Creating Hotel table
CREATE TABLE IF NOT EXISTS hotels (
  hotel_id SERIAL PRIMARY KEY,
  hotel_name VARCHAR(100) NOT NULL,
  city_id INT NOT NULL,
  room_type VARCHAR(50),
  price DECIMAL(10, 2),
  amenities TEXT,
  number_of_rooms INT NOT NULL,
  availability BOOLEAN,
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Location table
CREATE TABLE IF NOT EXISTS locations (
  location_id SERIAL PRIMARY KEY,
  location_name VARCHAR(100) NOT NULL,
  city_id INT NOT NULL,
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating TourGuide table
CREATE TABLE IF NOT EXISTS tour_guides (
  guide_id SERIAL PRIMARY KEY,
  guide_name VARCHAR(100) NOT NULL,
  country_id INT NOT NULL,
  expertise TEXT,
  rating DECIMAL(3, 2),
  per_day_charge DECIMAL(10, 2),
  availability BOOLEAN,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Package table
CREATE TABLE IF NOT EXISTS packages (
  package_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Booking table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(package_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Payment table
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  status VARCHAR(50),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating Picture table
CREATE TABLE IF NOT EXISTS pictures (
  picture_id SERIAL PRIMARY KEY,
  location_id INT,
  guide_id INT,
  country_id INT,
  picture_url VARCHAR(255),
  alt_text VARCHAR(255),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (guide_id) REFERENCES tour_guides(guide_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
