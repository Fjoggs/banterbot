ALTER TABLE random
    ADD [lukakuCounter] INTEGER;

UPDATE random SET lukakuCounter = 0 where randomId = 1;