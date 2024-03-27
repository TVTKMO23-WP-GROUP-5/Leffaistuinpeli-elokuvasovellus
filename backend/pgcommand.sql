CREATE TABLE account(
    idAccount INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fname TEXT,
    lname TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE groups(
    idGroup INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    groupname TEXT NOT NULL UNIQUE,
    description TEXT,
    idOwner INT NOT NULL REFERENCES account(idAccount)
);

CREATE TABLE groupmovies(
    idGroupmovie INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moviename TEXT NOT NULL,
    idGroup INT NOT NULL REFERENCES groups(idGroup)
);

CREATE TABLE groupmembers(
    idMember INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idGroup INT NOT NULL REFERENCES groups(idGroup),
    idAccount INT NOT NULL REFERENCES account(idAccount)
);

CREATE TABLE ratings(
    idRating INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moviename TEXT NOT NULL,
    idAccount INT NOT NULL REFERENCES account(idAccount),
    stars INT NOT NULL,
    texg TEXT
);

CREATE TABLE favorites(
    idFavorite INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moviename TEXT NOT NULL,
    idAccount INT NOT NULL REFERENCES account(idAccount)
);