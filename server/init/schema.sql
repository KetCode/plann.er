CREATE TABLE IF NOT EXISTS 'trips' (
    id TEXT PRIMARY KEY NOT NULL,
    destination TEXT NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS 'participants' (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    email TEXT NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    trip_id TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS 'activities' (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    occurs_at DATETIME NOT NULL,
    trip_id TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS 'links' (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    trip_id TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
