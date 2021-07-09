CREATE TABLE [challenges] (
    	[challengeId] INTEGER  NOT NULL PRIMARY KEY,
	    [name] NVARCHAR(50)  NOT NULL,
	    [options] NVARCHAR(100)  NOT NULL
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
	    [name] NVARCHAR(50)  NOT NULL
);

CREATE TABLE [scores] (
        [challengeId] INTEGER  NOT NULL,
	    [playerId] INTEGER  NOT NULL,
        [score] INTEGER NULL,
		PRIMARY KEY (challengeId, playerId),
		FOREIGN KEY (challengeId) REFERENCES challenges (challengeId) ON DELETE CASCADE ON UPDATE NO ACTION,
		FOREIGN KEY (playerId) REFERENCES players (playerId) ON DELETE CASCADE ON UPDATE NO ACTION
);