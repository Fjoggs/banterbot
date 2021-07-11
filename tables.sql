CREATE TABLE [challenges] (
    	[challengeId] INTEGER  NOT NULL PRIMARY KEY,
	    [name] NVARCHAR(50)  NOT NULL,
	    [options] NVARCHAR(100)  NOT NULL,
		[result] NVARCHAR(100) NULL
);

CREATE TABLE [bets] (
        [challengeId] INTEGER  NOT NULL,
	    [playerId] INTEGER  NOT NULL,
        [bet] NVARCHAR(100) NULL,
		PRIMARY KEY (challengeId, playerId),
		FOREIGN KEY (challengeId) REFERENCES challenges (challengeId) ON DELETE CASCADE ON UPDATE NO ACTION,
		FOREIGN KEY (playerId) REFERENCES players (playerId) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE [players] (
    	[playerId] INTEGER  NOT NULL PRIMARY KEY,
	    [name] NVARCHAR(50)  NOT NULL,
		[rep] INTEGER
);

CREATE TABLE [leagues] (
	[leagueId] INTEGER NOT NULL PRIMARY KEY,
	[name] NVARCHAR(100) NOT NULL
);

CREATE TABLE [player_leagues] (
	    [playerId] INTEGER  NOT NULL,
        [leagueId] INTEGER  NOT NULL,
        [rep] INTEGER NULL,
		PRIMARY KEY (playerId, leagueId),
		FOREIGN KEY (playerId) REFERENCES players (playerId) ON DELETE CASCADE ON UPDATE NO ACTION,
		FOREIGN KEY (leagueId) REFERENCES leagues (leagueId) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE [league_challenges] (
		[leagueId] INTEGER  NOT NULL,
	    [challengeId] INTEGER  NOT NULL,
		PRIMARY KEY (leagueId, challengeId),
		FOREIGN KEY (leagueId) REFERENCES leagues (leagueId) ON DELETE CASCADE ON UPDATE NO ACTION,
		FOREIGN KEY (challengeId) REFERENCES challenges (challengeId) ON DELETE CASCADE ON UPDATE NO ACTION
);

INSERT INTO players (name, rep) 
VALUES
    ('Fjoggs', 0),
    ('nwbi', 0),
    ('FN', 0),
    ('Vimbs', 0),
    ('Ulfos', 0),
    ('dun', 0),
    ('Torp', 0),
    ('taxi', 0),
    ('Nuppe', 0),
    ('biten', 0),
    ('gody', 0),
    ('Molbs', 0),
    ('Juell', 0);