BEGIN;

TRUNCATE
    dr_users,
    dr_dates
    RESTART IDENTITY CASCADE;

INSERT INTO dr_users (user_name, password, email, date_created)
VALUES
    ('Crayzix', '$2a$04$PeznXjgCRHNCL9121.GWV./JuTdgi05CCkGUJ/uQzHiUe8ALaBZlG', 'nick@nick.com', '2029-01-22T16:28:32.615Z'),
    ('Zixith', '$2a$04$TBsSABXz0fTYGIP6rii2G.xPudiFUsLVsYfMCxo6gTlA3eRN7nFre',  'carlo@carlo.com', '2029-01-22T16:28:32.615Z'),
    ('Zero', '$2a$04$nfsRVowvgmegXt5be1OOR.D2DzR1/7jLfRT4eLu/sL2eY5aXux/de',  'mark@mark.com', '2029-01-22T16:28:32.615Z'),
    ('Bigbarrels', '$2a$04$.mKSfqXboZ2e6n68YYJKVO/Neu9YpqdSHnetsPyYc8Y0frS5m/wUy', 'mario@mario.com', '2029-01-22T16:28:32.615Z'),
    ('Liquid', '$2a$04$mNxKDIpEqSbGtl/YwiAYnesOAQ4zJzJQWvYJ8cORkJcxeVfKmg0Oq', 'hayden@hayden.com', '2029-01-22T16:28:32.615Z');

INSERT INTO dr_dates (place_id, meal_id, drink_id, movie_id, user_id)
VALUES
    ('asdf123', 'asdf123', 'asdf123', 'asdf123', 1),
    ('asdf345', 'asdf345', 'asdf345', 'asdf345', 1),
    ('zxcv123', 'zxcv123', 'zxcv123', 'zxcv123', 2),
    ('qwer123', 'qwer123', 'qwer123', 'qwer123', 3),
    ('uiop123', 'uiop123', 'uiop123', 'uiop123', 4);

COMMIT;