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

INSERT INTO dr_dates (name, place_id, meal_id, meal_type, drink_id, show_id, show_type, user_id)
VALUES
    ('best date 1', 'ChIJ7U-BHeuzwoARAvYAqFtEc2A', '52906', 'In', '14229', '32669', 'Movie', 1),
    ('best date 2', 'ChIJ621AHF_QwoARxgHofQrJkEk', '53021', 'In', '14133', '63', 'Movie', 1),
    ('best date', 'ChIJ7U-BHeuzwoARAvYAqFtEc2A', '52906', 'In', '14229', '32669', 'Movie', 2),
    ('best date', 'ChIJ621AHF_QwoARxgHofQrJkEk', '52906', 'In', '14229', '63', 'Movie', 3),
    ('best date', 'ChIJ7U-BHeuzwoARAvYAqFtEc2A', '53021', 'In', '14133', '32669', 'Movie', 4);

COMMIT;