DROP TABLE IF EXISTS tours_guides;
DROP TABLE IF EXISTS tours_locations;
DROP TABLE IF EXISTS tours_start_location;
DROP TABLE IF EXISTS tours_start_dates;
DROP TABLE IF EXISTS tours_images;
DROP TABLE IF EXISTS tours;

CREATE TABLE IF NOT EXISTS tours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(300) NOT NULL,
  duration INT NOT NULL CHECK(duration > 0),
  max_group_size INT NOT NULL CHECK(max_group_size > 0),
  difficulty ENUM('easy', 'medium', 'difficult') NOT NULL,
  ratings_average FLOAT DEFAULT 0,
  ratings_quantity FLOAT DEFAULT 0,
  price FLOAT NOT NULL CHECK(price > 0),
  price_discount FLOAT DEFAULT NULL CHECK(price_discount > 0),
  summary VARCHAR(300) NOT NULL,
  description TEXT,
  image_cover VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tours_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image VARCHAR(300) NOT NULL,
  tour_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tours_start_dates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  start_date TIMESTAMP NOT NULL,
  tour_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tours_start_location (
  id INT PRIMARY KEY AUTO_INCREMENT,
  address VARCHAR(300),
  description TEXT,
  tour_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tours_locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  description TEXT,
  start_day INT,
  tour_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tours_guides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tour_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);