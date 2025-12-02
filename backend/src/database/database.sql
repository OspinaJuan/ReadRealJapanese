CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jmdict (
    id SERIAL PRIMARY KEY,
    kanji VARCHAR(255),
    meaning TEXT[],
    pitches INT[]
);