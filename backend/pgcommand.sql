CREATE TABLE account(
    idAccount INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(255),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE groups(
    idGroup INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    groupname VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    owner VARCHAR(50) NOT NULL REFERENCES account(username)
);

CREATE TABLE groupmovies(
    idGroupmovie INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idMovie INT NOT NULL,
    groupname VARCHAR(50) NOT NULL REFERENCES groups(groupname)
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
    username VARCHAR(50) NOT NULL REFERENCES account(username),
    stars INT NOT NULL,
    description TEXT
);

CREATE TABLE favorites(
    idFavorite INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idMovie INT NOT NULL,
    username VARCHAR(50) NOT NULL REFERENCES account(username)
);

*** TÄLLÄ VARMISTETAAN ETTÄ RYHMÄN LUOJASTA TULEE MYÖS RYHMÄN JÄSEN -TANELI ***

CREATE OR REPLACE FUNCTION add_owner_to_groupmembers()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO groupmembers(idGroup, idAccount, isMember)
    SELECT NEW.idGroup, account.idAccount, true
    FROM account
    WHERE account.username = NEW.owner;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_owner_to_groupmembers
AFTER INSERT ON groups
FOR EACH ROW
EXECUTE FUNCTION add_owner_to_groupmembers();