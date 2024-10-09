-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2024 at 01:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `natours`
--

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `review` text NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` > 0 and `rating` < 6),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tour_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `review`, `rating`, `created_at`, `tour_id`, `user_id`) VALUES
(2, 'Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eros condimentum scelerisque taciti mattis praesent feugiat eu nascetur a tincidunt', 5, '2024-09-20 04:25:53', 2, 5),
(3, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 04:26:54', 2, 5),
(4, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 04:57:16', 3, 5),
(5, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 05:10:20', 4, 5),
(6, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 05:16:39', 5, 5),
(7, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 05:16:52', 5, 5),
(8, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 05:17:02', 5, 5),
(9, 'Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!', 4, '2024-09-20 05:17:50', 5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `duration` int(11) NOT NULL CHECK (`duration` > 0),
  `max_group_size` int(11) NOT NULL CHECK (`max_group_size` > 0),
  `difficulty` enum('easy','medium','difficult') NOT NULL,
  `ratings_average` float DEFAULT 0,
  `ratings_quantity` float DEFAULT 0,
  `price` float NOT NULL CHECK (`price` > 0),
  `price_discount` float DEFAULT NULL CHECK (`price_discount` > 0),
  `summary` varchar(300) NOT NULL,
  `description` text DEFAULT NULL,
  `image_cover` varchar(300) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `name`, `duration`, `max_group_size`, `difficulty`, `ratings_average`, `ratings_quantity`, `price`, `price_discount`, `summary`, `description`, `image_cover`, `created_at`) VALUES
(2, 'The Sea Explorer', 7, 15, 'medium', 0, 0, 497, NULL, 'Exploring the jaw-dropping US east coast by foot and by boat', 'Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'tour-2-1728430881776-cover.jpeg', '2024-09-20 04:02:17'),
(3, 'The Forest Hiker', 5, 25, 'easy', 0, 0, 397, NULL, 'Breathtaking hike through the Canadian Banff National Park', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'tour-1-cover.jpg', '2024-09-20 04:11:08'),
(4, 'The Snow Adventurer', 4, 10, 'difficult', 0, 0, 997, NULL, 'Exciting adventure in the snow with snowboarding and skiing', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!', 'tour-3-cover.jpg', '2024-09-20 04:11:33'),
(5, 'The Park Camper', 10, 15, 'medium', 0, 0, 1497, NULL, 'Breathing in Nature in America&#x27;s most spectacular National Parks', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!', 'tour-5-cover.jpg', '2024-09-20 04:11:51'),
(6, 'The City Wanderer', 9, 20, 'easy', 0, 0, 1197, NULL, 'Living the life of Wanderlust in the US&#x27; most beatiful cities', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat lorem ipsum dolor sit amet.\nConsectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat!', 'tour-4-cover.jpg', '2024-09-20 04:12:21'),
(7, 'The Sports Lover', 14, 8, 'difficult', 0, 0, 2997, NULL, 'Surfing, skating, parajumping, rock climbing and more, all in one tour', 'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nVoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur!', 'tour-6-cover.jpg', '2024-09-20 04:12:44'),
(8, 'The Star Gazer', 9, 8, 'medium', 0, 0, 2997, NULL, 'The most remote and stunningly beautiful places for seeing the night sky', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'tour-8-cover.jpg', '2024-09-20 04:13:27'),
(9, 'The Northern Lights', 3, 12, 'easy', 0, 0, 1497, NULL, 'Enjoy the Northern Lights in one of the best places in the world', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!', 'tour-9-cover.jpg', '2024-09-20 04:13:51'),
(10, 'The Wine Taster', 5, 8, 'easy', 0, 0, 1997, NULL, 'Exquisite wines, scenic views, exclusive barrel tastings,  and much more', 'Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'tour-7-cover.jpg', '2024-09-20 04:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `tours_guides`
--

CREATE TABLE `tours_guides` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours_guides`
--

INSERT INTO `tours_guides` (`id`, `tour_id`, `user_id`) VALUES
(13, 2, 6),
(14, 2, 7),
(15, 2, 11),
(16, 3, 6),
(17, 3, 7),
(18, 3, 11),
(19, 4, 6),
(20, 4, 7),
(21, 4, 11),
(22, 5, 6),
(23, 5, 7),
(24, 5, 11),
(25, 6, 6),
(26, 6, 7),
(27, 6, 11),
(28, 7, 6),
(29, 7, 7),
(30, 7, 11),
(31, 8, 6),
(32, 8, 7),
(33, 8, 11),
(34, 9, 6),
(35, 9, 7),
(36, 9, 11),
(43, 10, 6),
(44, 10, 7),
(45, 10, 11);

-- --------------------------------------------------------

--
-- Table structure for table `tours_images`
--

CREATE TABLE `tours_images` (
  `id` int(11) NOT NULL,
  `image` varchar(300) NOT NULL,
  `tour_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours_images`
--

INSERT INTO `tours_images` (`id`, `image`, `tour_id`) VALUES
(7, 'tour-1-1.jpg', 3),
(8, 'tour-1-2.jpg', 3),
(9, 'tour-1-3.jpg', 3),
(10, 'tour-3-1.jpg', 4),
(11, 'tour-3-2.jpg', 4),
(12, 'tour-3-3.jpg', 4),
(13, 'tour-5-1.jpg', 5),
(14, 'tour-5-2.jpg', 5),
(15, 'tour-5-3.jpg', 5),
(16, 'tour-4-1.jpg', 6),
(17, 'tour-4-2.jpg', 6),
(18, 'tour-4-3.jpg', 6),
(19, 'tour-6-1.jpg', 7),
(20, 'tour-6-2.jpg', 7),
(21, 'tour-6-3.jpg', 7),
(22, 'tour-8-1.jpg', 8),
(23, 'tour-8-2.jpg', 8),
(24, 'tour-8-3.jpg', 8),
(25, 'tour-9-1.jpg', 9),
(26, 'tour-9-2.jpg', 9),
(27, 'tour-9-3.jpg', 9),
(28, 'tour-7-1.jpg', 10),
(29, 'tour-7-2.jpg', 10),
(30, 'tour-7-3.jpg', 10),
(34, 'tour-2-1728430881876-2.jpeg', 2),
(35, 'tour-2-1728430881876-1.jpeg', 2),
(36, 'tour-2-1728430881878-3.jpeg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tours_locations`
--

CREATE TABLE `tours_locations` (
  `id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `start_day` int(11) DEFAULT NULL,
  `tour_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours_locations`
--

INSERT INTO `tours_locations` (`id`, `description`, `start_day`, `tour_id`) VALUES
(5, 'Lummus Park Beach', 1, 2),
(6, 'Islamorada', 2, 2),
(7, 'Sombrero Beach', 3, 2),
(8, 'West Key', 5, 2),
(9, 'Banff National Park', 1, 3),
(10, 'Jasper National Park', 3, 3),
(11, 'Glacier National Park of Canada', 5, 3),
(12, 'Aspen Highlands', 1, 4),
(13, 'Beaver Creek', 2, 4),
(14, 'Zion Canyon National Park', 1, 5),
(15, 'Antelope Canyon', 4, 5),
(16, 'Grand Canyon National Park', 5, 5),
(17, 'Joshua Tree National Park', 9, 5),
(18, 'New York', 1, 6),
(19, 'Los Angeles', 3, 6),
(20, 'San Francisco', 5, 6),
(21, 'Point Dume Beach', 1, 7),
(22, 'Venice Skate Park', 4, 7),
(23, 'San Diego Skydive', 6, 7),
(24, 'Kern River Rafting', 7, 7),
(25, 'Yosemite National Park', 10, 7),
(26, 'Natural Bridges National Monument', 1, 8),
(27, 'Horseshoe Bend', 3, 8),
(28, 'Death Valley National Park', 6, 8),
(29, 'Yellowknife', 1, 9),
(30, 'Beringer Vineyards', 1, 10),
(31, 'Clos Pegase Winery &amp; Tasting Room', 3, 10),
(32, 'Raymond Vineyard and Cellar', 5, 10);

-- --------------------------------------------------------

--
-- Table structure for table `tours_start_dates`
--

CREATE TABLE `tours_start_dates` (
  `id` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tour_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours_start_dates`
--

INSERT INTO `tours_start_dates` (`id`, `start_date`, `tour_id`) VALUES
(4, '2021-06-19 09:00:00', 2),
(5, '2021-07-20 09:00:00', 2),
(6, '2021-08-18 09:00:00', 2),
(7, '2021-04-25 09:00:00', 3),
(8, '2021-07-20 09:00:00', 3),
(9, '2021-10-05 09:00:00', 3),
(10, '2022-01-05 10:00:00', 4),
(11, '2022-02-12 10:00:00', 4),
(12, '2023-01-06 10:00:00', 4),
(13, '2021-08-05 09:00:00', 5),
(14, '2022-03-20 10:00:00', 5),
(15, '2022-08-12 09:00:00', 5),
(16, '2021-03-11 10:00:00', 6),
(17, '2021-05-02 09:00:00', 6),
(18, '2021-06-09 09:00:00', 6),
(19, '2021-07-19 09:00:00', 7),
(20, '2021-09-06 09:00:00', 7),
(21, '2022-03-18 10:00:00', 7),
(22, '2021-03-23 10:00:00', 8),
(23, '2021-10-25 09:00:00', 8),
(24, '2022-01-30 10:00:00', 8),
(25, '2021-12-16 10:00:00', 9),
(26, '2022-01-16 10:00:00', 9),
(27, '2022-12-12 10:00:00', 9),
(28, '2021-02-12 10:00:00', 10),
(29, '2021-04-14 09:00:00', 10),
(30, '2021-09-01 09:00:00', 10);

-- --------------------------------------------------------

--
-- Table structure for table `tours_start_location`
--

CREATE TABLE `tours_start_location` (
  `id` int(11) NOT NULL,
  `address` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tour_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours_start_location`
--

INSERT INTO `tours_start_location` (`id`, `address`, `description`, `tour_id`) VALUES
(2, '301 Biscayne Blvd, Miami, FL 33132, USA', 'Miami, USA', 2),
(3, '224 Banff Ave, Banff, AB, Canada', 'Banff, CAN', 3),
(4, '419 S Mill St, Aspen, CO 81611, USA', 'Aspen, USA', 4),
(5, '3663 S Las Vegas Blvd, Las Vegas, NV 89109, USA', 'Las Vegas, USA', 5),
(6, 'Manhattan, NY 10036, USA', 'NYC, USA', 6),
(7, '29130 Cliffside Dr, Malibu, CA 90265, USA', 'California, USA', 7),
(8, 'Bluff, UT 84512, USA', 'Utah, USA', 8),
(9, 'Yellowknife, NT X1A 2L2, Canada', 'Yellowknife, CAN', 9),
(10, '560 Jefferson St, Napa, CA 94559, USA', 'California, USA', 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `password` varchar(300) NOT NULL,
  `photo` varchar(300) DEFAULT NULL,
  `role` enum('admin','lead-guide','guide','user') NOT NULL DEFAULT 'user',
  `active` tinyint(1) DEFAULT 1,
  `password_changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password_reset_token` varchar(300) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `photo`, `role`, `active`, `password_changed_at`, `password_reset_token`, `password_reset_expires`) VALUES
(2, 'Jawdat Samer', 'admin@example.com', '$2a$12$MkbcWnSq8x435kE/F.xX.e6er8ULlO2aXYehky5JvNhiYJfOfbLHK', 'user-2-1728059820156.jpeg', 'admin', 1, '2024-10-04 15:38:55', NULL, NULL),
(3, 'Lourdes Browning', 'loulou@example.com', '$2a$12$iQ2WsRK19nqeyTrmuEordu74LjLQuiECx.jqZJLO1StZY0mY0OUW2', 'user-2.jpg', 'user', 1, '2024-09-20 04:17:45', NULL, NULL),
(4, 'Sophie Louise Hart', 'sophie@example.com', '$2a$12$uU6mn90.PrcxW/zink7kA.OKKqMrlwqDUiMgHyMZ.HPbqp6zxnHWy', 'user-3.jpg', 'user', 1, '2024-09-20 04:17:55', NULL, NULL),
(5, 'Ayla Cornell', 'ayls@example.com', '$2a$12$tZgvK3U/jiXKrh56oWGYOeJMDRfqivykZO1sdBVKxi7OJStCVeALi', 'user-4.jpg', 'user', 1, '2024-09-20 04:18:11', NULL, NULL),
(6, 'Leo Gillespie', 'leo@example.com', '$2a$12$dxnbHjO7r/ZaFHRRvwiG7O1YrIl3SOIqIQpgJDZXXig0rs1by3hnK', 'user-5.jpg', 'guide', 1, '2024-09-20 04:18:20', NULL, NULL),
(7, 'Jennifer Hardy', 'jennifer@example.com', '$2a$12$/0NWT9IJfwUKM1AnY1G.NupFH0Ju0RDRRXSLy4Eu6unlJObKiWUU.', 'user-6.jpg', 'guide', 1, '2024-09-20 04:18:50', NULL, NULL),
(8, 'Kate Morrison', 'kate@example.com', '$2a$12$b7xc0HbZHMlXVjrnCyIRyuc9wcAHz44tLR38QaJ.RHCEIV7D4Z8Ne', 'user-7.jpg', 'guide', 1, '2024-09-20 04:20:49', NULL, NULL),
(9, 'Eliana Stout', 'eliana@example.com', '$2a$12$bjnbZxL57mI9wsUV.0rbleKhNYunDF9j/HVCrlMKamdo66hsLxYdK', 'user-8.jpg', 'user', 1, '2024-09-20 04:21:10', NULL, NULL),
(10, 'Cristian Vega', 'chris@example.com', '$2a$12$eNnb/IySHsp8Avt/O9FlSuOOo7eQQB5wT/7LJLm43AiNb9I21B3ju', 'user-9.jpg', 'user', 1, '2024-09-20 04:21:25', NULL, NULL),
(11, 'Steve T. Scaife', 'steve@example.com', '$2a$12$R6io09C0nVF4Ywwu9PXze.Z0u8sMg3HhY96o0kvXhTcyLKzH4OBuK', 'user-10.jpg', 'lead-guide', 1, '2024-09-20 04:21:41', NULL, NULL),
(12, 'Aarav Lynn', 'aarav@example.com', '$2a$12$n6iwTQZ2Ay13t1cCP1IIUupgBB7sC1rAK4VcabuLCFRFhrPXbZJP.', 'user-11.jpg', 'lead-guide', 1, '2024-09-20 04:21:53', NULL, NULL),
(13, 'Miyah Myles', 'miyah@example.com', '$2a$12$wr84GbfpUiuRV3Fr3u4sNebjhLulx7NRMVof9rOKdRxuBoun/YKpu', 'user-12.jpg', 'lead-guide', 1, '2024-09-20 04:22:02', NULL, NULL),
(14, 'Ben Hadley', 'ben@example.com', '$2a$12$iqCP4uWfwmO47GTImP5squ5oRUVG9EspaQi3agrc.uxm3e58MkJS.', 'user-13.jpg', 'guide', 1, '2024-09-20 04:22:13', NULL, NULL),
(15, 'Laura Wilson', 'laura@example.com', '$2a$12$7qmzQEjY4Pwnq/v7eAPPnOqGP8s7yUzVnSYENzNQtKeR0V1llq95m', 'user-14.jpg', 'user', 1, '2024-09-20 04:22:31', NULL, NULL),
(16, 'Laura', 'laura2@example.com', '$2a$12$nhHXocE/sBYAn/sEaUE30OnRVPEzh4A.087130jBchcuf9DSXP2Sq', 'user-16-1728063275577.jpeg', 'user', 1, '2024-10-04 16:53:37', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tours_guides`
--
ALTER TABLE `tours_guides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tours_images`
--
ALTER TABLE `tours_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tours_locations`
--
ALTER TABLE `tours_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tours_start_dates`
--
ALTER TABLE `tours_start_dates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tours_start_location`
--
ALTER TABLE `tours_start_location`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tours_guides`
--
ALTER TABLE `tours_guides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `tours_images`
--
ALTER TABLE `tours_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `tours_locations`
--
ALTER TABLE `tours_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tours_start_dates`
--
ALTER TABLE `tours_start_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `tours_start_location`
--
ALTER TABLE `tours_start_location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours_guides`
--
ALTER TABLE `tours_guides`
  ADD CONSTRAINT `tours_guides_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tours_guides_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours_images`
--
ALTER TABLE `tours_images`
  ADD CONSTRAINT `tours_images_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours_locations`
--
ALTER TABLE `tours_locations`
  ADD CONSTRAINT `tours_locations_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours_start_dates`
--
ALTER TABLE `tours_start_dates`
  ADD CONSTRAINT `tours_start_dates_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tours_start_location`
--
ALTER TABLE `tours_start_location`
  ADD CONSTRAINT `tours_start_location_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
