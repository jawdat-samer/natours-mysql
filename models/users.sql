DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(300) NOT NULL,
  email VARCHAR(300) NOT NULL,
  password VARCHAR(300) NOT NULL,
  photo VARCHAR(300),
  role ENUM('admin', 'lead-guide', 'guide', 'user') DEFAULT 'user' NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password_reset_token VARCHAR(300),
  password_reset_expires DATETIME DEFAULT NULL,
  CONSTRAINT email UNIQUE(email)
);
