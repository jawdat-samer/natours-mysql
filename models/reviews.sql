DROP TABLE IF EXISTS reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review TEXT NOT NULL,
  rating INT NOT NULL CHECK(rating > 0 AND rating < 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tour_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);