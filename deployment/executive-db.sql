--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: executive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.executive (
                                  id_executive bigint NOT NULL,
                                  dad_surname character varying(255),
                                  email character varying(255),
                                  mother_surname character varying(255),
                                  name character varying(255),
                                  password character varying(255),
                                  rut character varying(255) NOT NULL
);


ALTER TABLE public.executive OWNER TO postgres;

--
-- Name: executive_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.executive_seq
    AS integer
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.executive_seq OWNER TO postgres;

--
-- Data for Name: executive; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.executive (id_executive, dad_surname, email, mother_surname, name, password, rut) FROM stdin;
1	presta	admin@usach.cl	banco	admin	asdfg67	999999-9
\.

--
-- Name: executive_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.executive_seq', 1, false);

--
-- PostgreSQL database dump complete
--