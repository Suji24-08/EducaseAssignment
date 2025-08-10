CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);

select * from schools;

INSERT INTO schools (name, address, latitude, longitude)
VALUES
('Delhi Public School', 'Sector 12, R.K. Puram, New Delhi', 28.5672, 77.2100),
('St. Xavier\'s High School', 'Civil Lines, Jaipur', 26.9260, 75.8235),
('Bishop Cotton School', 'Shimla, Himachal Pradesh', 31.1048, 77.1734),
('La Martiniere College', 'Hazratganj, Lucknow', 26.8467, 80.9462),
('Don Bosco High School', 'Matunga, Mumbai', 19.0760, 72.8777),
('St. Paul\'s School', 'Darjeeling, West Bengal', 27.0410, 88.2663),
('DAV Public School', 'Sector 14, Gurugram, Haryana', 28.4595, 77.0266),
('National Public School', 'Indiranagar, Bengaluru', 12.9716, 77.5946),
('St. Joseph\'s Academy', 'Rajpur Road, Dehradun', 30.3165, 78.0322),
('The Hyderabad Public School', 'Begumpet, Hyderabad', 17.3850, 78.4867);

ALTER TABLE schools ADD UNIQUE unique_school (name, address);



