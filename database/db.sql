CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50) NO UNIQUE KEY,
    password VARCHAR(255),
    ph_number VARCHAR(50),
    primary_address VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    zipcode VARCHAR(10),
    country VARCHAR(30),
    INDEX(id,email,password)
)

CREATE TABLE city (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64),
    state VARCHAR(64),
    INDEX(id, name,state),
    created_at DATETIME,
    updated_at DATETIME
);

INSERT INTO `city` (`id`, `name`, `state`) VALUES ('8fc6f20b-61a6-4fe9-8855-baa130f3a352', 'Mumbai', 'Maharashtra'), ('f4b141b3-0b20-45a9-ada1-01726bece6e3', 'Pune', 'Maharashtra');
INSERT INTO `city` (`id`, `name`, `state`) VALUES ('ebb42405-83ba-4218-8dee-9362d36750da', 'NCR', 'Delhi'), ('c4aef327-46ed-43de-906c-d9a0e6d5b165', 'Chandigarh', 'Punjab');

CREATE TABLE cinemas (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64),
    total_cinema_halls SMALLINT(10),
    zipcode VARCHAR(16),
    city_id VARCHAR(36),
    CONSTRAINT `fk_city`
    FOREIGN KEY(city_id) REFERENCES city(id),
    INDEX(id,name,zipcode,city_id),
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE cinema_halls (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64),
    total_seats SMALLINT(10),
    cinema_id VARCHAR(36),
    CONSTRAINT `fk_cinema`
    FOREIGN KEY(cinema_id) REFERENCES cinemas(id),
    INDEX(id,name,cinema_id),
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE cinema_seats (
    id VARCHAR(36) PRIMARY KEY,
    seat_number SMALLINT(10),
    cinema_hall_id VARCHAR(36),
    CONSTRAINT `fk_cinema_hall`
    FOREIGN KEY(cinema_hall_id) REFERENCES cinema_halls(id),
    INDEX(id,seat_number,cinema_hall_id),
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE movies (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(256),
    description VARCHAR(512),
    duration DATETIME,
    language varchar(16),
    release_date varchar(16),
    country varchar(64),
    genre varchar(20),
    INDEX(id,title,duration,release_date),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE shows (
    id VARCHAR(36) PRIMARY KEY,
    date TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,

    cinema_hall_id VARCHAR(36),
    CONSTRAINT `fk_cinema_halls`
    FOREIGN KEY(cinema_hall_id) REFERENCES cinema_halls(id),

    movie_id VARCHAR(36),
    CONSTRAINT `fk_movies`
    FOREIGN KEY(movie_id) REFERENCES movies(id),
    INDEX(id,movie_id,cinema_hall_id),
    created_at DATETIME,
    updated_at DATETIME
);



CREATE TABLE show_seats(
    id VARCHAR(36) PRIMARY KEY,
STATUS ENUM
    (
        'Available',
        'Booked',
        'Not Available'
    ),
    price INT(20),
    cinema_seat_id VARCHAR(36),
    booking_id VARCHAR(36),
    show_id VARCHAR(36),

    CONSTRAINT `fk_bookings` FOREIGN KEY(booking_id) REFERENCES bookings(id),
    CONSTRAINT `fk_cinema_seats` FOREIGN KEY(cinema_seat_id) REFERENCES cinema_seats(id),
    CONSTRAINT `fk_shows_show_seats` FOREIGN KEY(show_id) REFERENCES shows(id),


    created_at DATETIME,
    updated_at DATETIME,
    INDEX(
        id,

        cinema_seat_id,
        booking_id,
    STATUS
    )
);

CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    number_of_seats SMALLINT(6),

    status ENUM('Available','Booked','Not Available'),

    user_id VARCHAR(36),
    CONSTRAINT `fk_users`
    FOREIGN KEY(user_id) REFERENCES users(id),

    show_id VARCHAR(36),
    CONSTRAINT `fk_shows`
    FOREIGN KEY(show_id) REFERENCES shows(id),
    created_at DATETIME,
    updated_at DATETIME,
    INDEX(id,show_id,user_id)
);

CREATE TABLE payments(
    id VARCHAR(36) PRIMARY KEY,
    number_of_seats SMALLINT(6),
    amount INT(56),
    payment_method ENUM('UPI', 'Net Banking', 'Cash'),
    booking_id VARCHAR(36),
    CONSTRAINT `fk_bookings_payment` FOREIGN KEY(booking_id) REFERENCES bookings(id),
    created_at DATETIME,
    updated_at DATETIME,
    INDEX(id, booking_id)
);





-- Cinema Hall List
INSERT INTO `cinemas` (`id`, `name`, `total_cinema_halls`, `zipcode`, `city_id`) VALUES ('1d4ba0ff-ebfa-4502-a263-fc2203cbb5f9', 'Neelam Cinema', '2', '160017', 'c4aef327-46ed-43de-906c-d9a0e6d5b165'), ('a79a37cb-10e9-4891-a204-787ae73536d5', 'DT City Centre Mall Chandigarh', '4', '160017', 'c4aef327-46ed-43de-906c-d9a0e6d5b165'), ('732a1242-c4d6-48c7-bf3a-c1a81edec3f9', 'Wave Cinemas', '3', '160002', 'c4aef327-46ed-43de-906c-d9a0e6d5b165'), ('4edfae94-6c8b-4e1d-8049-e894bba12c22', 'Carnival Cinemas Odeon', '4', '110001', 'ebb42405-83ba-4218-8dee-9362d36750da'), ('50de0d7c-d120-4345-b131-2aeaa3ad6112', 'Delite Cinema', '4', '110002', 'ebb42405-83ba-4218-8dee-9362d36750da'), ('2e802f77-7242-4198-a87c-40495b2347a7', 'PVR Vikaspuri', '3', '110018', 'ebb42405-83ba-4218-8dee-9362d36750da'), ('03731ebe-e359-425e-aa69-32fac85bac81', 'City Pride Royal Cinemas', '3', '411017', 'f4b141b3-0b20-45a9-ada1-01726bece6e3'), ('54e21f70-ea59-40c5-8f4b-71ca5d49105a', 'PVR ICON Pavilion Mall Pune', '3', '411016', 'f4b141b3-0b20-45a9-ada1-01726bece6e3');





INSERT
INTO
    `cinema_halls`(
        `id`,
        `name`,
        `total_seats`,
        `cinema_id`
    )
VALUES(
    '804fc295-ab60-4ba0-a7b4-2d649cd32c14',
    'Screen 1',
    '10',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    '489fa5e4-cdff-43fe-b929-cf238f18214a',
    'Screen 2',
    '10',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    '16265326-adf7-4248-b9ca-db7c927e9cdf',
    'Screen 1',
    '10',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    'cfa1dcaa-ed45-4b74-bc2a-33bacfb6402e',
    'Screen 1',
    '10',
    '2e802f77-7242-4198-a87c-40495b2347a7'
),(
    'fa3e9d27-ea1c-4ffb-9083-d243f04b79c0',
    'Screen 2',
    '10',
    '2e802f77-7242-4198-a87c-40495b2347a7'
),(
    '3edb8301-7d28-4536-94ff-76b083114c65',
    'Screen 3',
    '10',
    '2e802f77-7242-4198-a87c-40495b2347a7'
),(
    '8919000c-a1ba-43a0-a343-32aeabe1a840',
    'Screen 1',
    '10',
    '03731ebe-e359-425e-aa69-32fac85bac81'
),(
    '4788e3d8-303f-4517-95b0-4d1e7ef290e9',
    'Screen 2',
    '10',
    '03731ebe-e359-425e-aa69-32fac85bac81'
),(
    'cdf2b2d2-c4ce-44b7-985c-81e2b8df274b',
    'Screen 3',
    '10',
    '03731ebe-e359-425e-aa69-32fac85bac81'
),(
    '085db8ab-b625-4cf6-be12-38e2d62e91e2',
    'Screen 1',
    '10',
    '1d4ba0ff-ebfa-4502-a263-fc2203cbb5f9'
),(
    'bd3dc772-9613-4104-98d8-7098736f3a59',
    'Screen 2',
    '10',
    '1d4ba0ff-ebfa-4502-a263-fc2203cbb5f9'
),(
    'e889fc63-2e6d-4c81-abc3-264c418fdea1',
    'Screen 1',
    '8',
    '4edfae94-6c8b-4e1d-8049-e894bba12c22'
),(
    'f3bf01e1-871b-4f1a-8651-31e352da153c',
    'Screen 2',
    '8',
    '4edfae94-6c8b-4e1d-8049-e894bba12c22'
),(
    'e625edd7-0aa4-4802-834f-f1427fcb6a00',
    'Screen 3',
    '7',
    '4edfae94-6c8b-4e1d-8049-e894bba12c22'
),(
    '51a40a6d-d451-426c-83b0-11df96dbedae',
    'Screen 4',
    '10',
    '4edfae94-6c8b-4e1d-8049-e894bba12c22'
),(
    '8def09f5-50af-4041-a27e-d89c70b38bfa',
    'Screen 1',
    '10',
    '50de0d7c-d120-4345-b131-2aeaa3ad6112'
),(
    'bd16ad4c-76b0-459b-b45c-84d1a5f9fffd',
    'Screen 2',
    '10',
    '50de0d7c-d120-4345-b131-2aeaa3ad6112'
),(
    'a63ab315-5bf4-48bb-8f01-9efab064ae8f',
    'Screen 3',
    '8',
    '50de0d7c-d120-4345-b131-2aeaa3ad6112'
),(
    'ddc9c14a-49d8-452d-9425-224b172ae524',
    'Screen 4',
    '8',
    '50de0d7c-d120-4345-b131-2aeaa3ad6112'
),(
    'f05a80bd-ec89-4f96-a877-1c5e2a3eddfe',
    'Screen 1',
    '10',
    '54e21f70-ea59-40c5-8f4b-71ca5d49105a'
),(
    '7dea3d4a-a773-44f8-b7e5-8c3413e310c2',
    'Screen 2',
    '10',
    '54e21f70-ea59-40c5-8f4b-71ca5d49105a'
),(
    '09d80444-7ca5-40b7-a248-62e8e74e24fe',
    'Screen 3',
    '5',
    '54e21f70-ea59-40c5-8f4b-71ca5d49105a'
),(
    'a7febe43-c8e2-472a-aad8-5f2116c4615f',
    'Screen 1',
    '15',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    'cb330016-602c-40fd-b371-fa9ec6609365',
    'Screen 2',
    '10',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    'd2603b46-d71d-4829-b2c7-a784d81b9b64',
    'Screen 3',
    '10',
    '732a1242-c4d6-48c7-bf3a-c1a81edec3f9'
),(
    'e9587ff4-c43b-4ce2-b39a-db15435c0cc6',
    'Screen 1',
    '10',
    'b3f685a7-6d6d-406a-ab2b-aa3197791fa5'
),(
    '1c518bfb-4195-48b2-9b1b-de98a097e416',
    'Screen 2',
    '10',
    'b3f685a7-6d6d-406a-ab2b-aa3197791fa5'
),(
    'e2fcce4a-2f1b-443d-b845-b4ed2355ce09',
    'Screen 3',
    '10',
    'b3f685a7-6d6d-406a-ab2b-aa3197791fa5'
),(
    'fed3119c-e9bf-45dc-808d-6986f9a03bb1',
    'Screen 4',
    '10',
    'b3f685a7-6d6d-406a-ab2b-aa3197791fa5'
),(
    'cf329785-9d4e-4da0-97de-03e97b09df99',
    'Screen 1',
    '10',
    'a79a37cb-10e9-4891-a204-787ae73536d5'
),(
    'e5f22d86-492c-44bf-911c-33760a991f92',
    'Screen 2',
    '10',
    'a79a37cb-10e9-4891-a204-787ae73536d5'
),(
    '36500a42-a3e6-4086-9737-db336d97b5b9',
    'Screen 3',
    '10',
    'a79a37cb-10e9-4891-a204-787ae73536d5'
),(
    '637426ff-9e49-4cbf-a249-67fbc411b49b',
    'Screen 3',
    '10',
    'a79a37cb-10e9-4891-a204-787ae73536d5'
),(
    '12668728-8434-4068-badb-44264ae831bf',
    'Screen 4',
    '10',
    'a79a37cb-10e9-4891-a204-787ae73536d5'
),(
    '855cbe2b-a32c-4f3a-8020-e810de1795b6',
    'Screen 1',
    '10',
    '77e0b669-893d-4570-98d5-5cbd95743e51'
),(
    '790c0e60-e5b3-4815-92b4-082a0c9ded25',
    'Screen 2',
    '10',
    '77e0b669-893d-4570-98d5-5cbd95743e51'
),(
    '3c2a2f61-85da-43d9-bda6-d7aa20d69707',
    'Screen 3',
    '8',
    '77e0b669-893d-4570-98d5-5cbd95743e51'
),(
    'b85e7381-aa11-44b4-8533-ade10ec1e3cf',
    'Screen 4',
    '5',
    '77e0b669-893d-4570-98d5-5cbd95743e51'
)



INSERT INTO `cinema_seats` (`id`, `seat_number`, `cinema_hall_id`) VALUES ('569919a1-22b0-4c5a-b43c-cf3e9d2d96a9', '1', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('33e85aa9-90b9-4920-b298-476c24f95550', '2', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('e4bfd5dc-9903-40b1-ba7e-1d16f8f959ea', '3', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('1160956f-d5d6-472d-87de-96b1c2c1701b', '4', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('db68c4b1-ecff-43f7-a050-57e7dc2671d8', '5', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('a2f4723d-171e-43fd-a131-8b564cbeb83c', '6', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('75f64f21-d7ea-4ae1-9aad-e817c2ad7d55', '7', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('c2e1d060-4c98-455b-93b7-d21d5919bd00', '8', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('ac777b81-4dac-4b89-9949-4018f812539c', '9', '09d80444-7ca5-40b7-a248-62e8e74e24fe'), ('45dc755e-6ec3-47bd-86a1-6051039b2b3f', '10', '09d80444-7ca5-40b7-a248-62e8e74e24fe');
