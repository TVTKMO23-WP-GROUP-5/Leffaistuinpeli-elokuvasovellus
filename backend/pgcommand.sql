CREATE TABLE account(
    idAccount INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fname TEXT,
    lname TEXT,
    email TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE groups(
    idGroup INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    groupname TEXT NOT NULL UNIQUE,
    description TEXT,
    owner TEXT NOT NULL REFERENCES account(username)
);

CREATE TABLE groupmovies(
    idGroupmovie INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moviename TEXT NOT NULL,
    idGroup INT NOT NULL REFERENCES groups(idGroup)
);

CREATE TABLE groupmembers(
    idMember INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idGroup INT NOT NULL REFERENCES groups(idGroup),
    idAccount INT NOT NULL REFERENCES account(idAccount),
    isMember BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_group_member UNIQUE (idGroup, idAccount) --määrittelee,että idGroupin ja idAccountin samoja yhdistelmiä voi olla vain yksi.  
);


CREATE TABLE ratings(
    idRating INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idMovie INT NOT NULL,
    username INT NOT NULL REFERENCES account(username),
    stars INT NOT NULL,
    description TEXT
);

CREATE TABLE favorites(
    idFavorite INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moviename TEXT NOT NULL,
    idAccount INT NOT NULL REFERENCES account(idAccount)
);

*** TÄLLÄ VARMISTETAAN ETTÄ RYHMÄN LUOJASTA TULEE MYÖS RYHMÄN JÄSEN -TANELI ***

CREATE OR REPLACE FUNCTION add_owner_to_groupmembers()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO groupmembers(idGroup, idAccount)
    SELECT NEW.idGroup, account.idAccount
    FROM account
    WHERE account.username = NEW.owner;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_owner_to_groupmembers
AFTER INSERT ON groups
FOR EACH ROW
EXECUTE FUNCTION add_owner_to_groupmembers();