CREATE TABLE [Challenge] (
    	[challengeId] INTEGER  NOT NULL PRIMARY KEY,
	    [name] NVARCHAR(50)  NOT NULL
);
CREATE TABLE [Player] (
    	[playerId] INTEGER  NOT NULL PRIMARY KEY,
	    [name] NVARCHAR(50)  NOT NULL
);
CREATE TABLE [Score] (
        [challengeId] INTEGER  NOT NULL,
	    [playerId] INTEGER  NOT NULL,
        [score] INTEGER NULL,
		PRIMARY KEY (challengeId, playerId),
		FOREIGN KEY (challengeId) REFERENCES Challenge (challengeId) ON DELETE CASCADE ON UPDATE NO ACTION,
		FOREIGN KEY (playerId) REFERENCES Player (playerId) ON DELETE CASCADE ON UPDATE NO ACTION
);