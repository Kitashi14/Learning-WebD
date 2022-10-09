-- we can @block to create different blocks with its own play buttons to run it (a speciality of vsCode client not mySQL)
-- with the help of this we don't have to create multiple files
-- @block 
-- creating table with its schema
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    country VARCHAR(2)
);
-- @block
-- inserting data in table row-wise
-- single coloumn will be inserted
INSERT INTO Users (email, bio, country) -- order of variables to insert is important 
VALUES (
        -- not inserting id as we set it to auto-increment
        'abc@gmail.com',
        'just a demo data for helping the developer to understand this',
        'IN'
    );
-- @block
-- inserting multiple coloumn in one go
INSERT INTO Users (email, bio, country)
VALUES (
        "abcd@gmail.com",
        "another demo data",
        'IN'
    ),
    (
        'abcde@gmail.com',
        'one more',
        'IN'
    );
-- @block
-- reading/ showing the whole table
SELECT *
FROM Users;     