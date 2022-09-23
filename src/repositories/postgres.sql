-- Database: alpha-multi

-- DROP DATABASE IF EXISTS "alpha-multi";

CREATE DATABASE "alpha-multi"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Table: public.auctions

-- DROP TABLE IF EXISTS public.auctions;

CREATE TABLE IF NOT EXISTS public.auctions
(
    auction_id text COLLATE pg_catalog."default" NOT NULL,
    winner_id text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    photo text COLLATE pg_catalog."default" NOT NULL,
    initial_price text COLLATE pg_catalog."default" NOT NULL,
    winner_price text COLLATE pg_catalog."default",
    open_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    close_at timestamp without time zone NOT NULL,
    CONSTRAINT auctions_pkey PRIMARY KEY (auction_id),
    CONSTRAINT auctions_name_key UNIQUE (name),
    CONSTRAINT auctions_winner_id_fkey FOREIGN KEY (winner_id)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.auctions
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    userid text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (userid),
    CONSTRAINT users_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;