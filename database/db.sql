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


