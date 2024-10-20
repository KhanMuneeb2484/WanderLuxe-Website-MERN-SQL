-- Creating User table
CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  phone_number VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('admin', 'user'))

);

-- Creating Country table
CREATE TABLE Country (
  country_id INT PRIMARY KEY AUTO_INCREMENT,
  country_name VARCHAR(100)
);

-- Creating City table
CREATE TABLE City (
  city_id INT PRIMARY KEY AUTO_INCREMENT,
  city_name VARCHAR(100),
  country_id INT,
  FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

-- Creating Hotel table
CREATE TABLE Hotel (
  hotel_id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_name VARCHAR(100),
  city_id INT,
  room_type VARCHAR(50),
  price DECIMAL(10, 2),
  amenities TEXT,
  availability BOOLEAN,
  FOREIGN KEY (city_id) REFERENCES City(city_id)
);

-- Creating Location table
CREATE TABLE Location (
  location_id INT PRIMARY KEY AUTO_INCREMENT,
  location_name VARCHAR(100),
  city_id INT,
  FOREIGN KEY (city_id) REFERENCES City(city_id)
);

-- Creating TourGuide table
CREATE TABLE TourGuide (
  guide_id INT PRIMARY KEY AUTO_INCREMENT,
  guide_name VARCHAR(100),
  country_id INT,
  expertise TEXT,
  rating DECIMAL(3, 2),
  per_day_charge DECIMAL(10, 2),
  availability BOOLEAN,
  FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

-- Creating Package table
CREATE TABLE Package (
  package_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  total_price DECIMAL(10, 2),
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Creating Booking table
CREATE TABLE Booking (
  booking_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  package_id INT,
  status VARCHAR(50),
  payment_id INT,
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (package_id) REFERENCES Package(package_id),
  FOREIGN KEY (payment_id) REFERENCES Payment(payment_id)
);

-- Creating Payment table
CREATE TABLE Payment (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(10, 2),
  payment_date DATETIME,
  payment_method VARCHAR(50),
  status VARCHAR(50)
);

-- Creating Location_Pictures table to store pictures of locations and tour guides
CREATE TABLE Location_Pictures (
  picture_id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT,
  guide_id INT,  -- Adding guide_id reference
  picture_url VARCHAR(255),
  alt_text VARCHAR(255),
  FOREIGN KEY (location_id) REFERENCES Location(location_id),
  FOREIGN KEY (guide_id) REFERENCES TourGuide(guide_id)  -- Reference to TourGuide table
);