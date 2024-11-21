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
-- Name: client_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
                                 age integer NOT NULL,
                                 amount_of_late_payments integer NOT NULL,
                                 consistent_save_history boolean NOT NULL,
                                 independent_worker boolean NOT NULL,
                                 late_payments boolean NOT NULL,
                                 min_cash_on_account boolean NOT NULL,
                                 periodic_deposits boolean NOT NULL,
                                 recent_withdraws boolean NOT NULL,
                                 relation_years_and_balance boolean NOT NULL,
                                 working boolean NOT NULL,
                                 working_years integer NOT NULL,
                                 id_customer bigint NOT NULL,
                                 dad_surname character varying(255),
                                 email character varying(255),
                                 mother_surname character varying(255),
                                 name character varying(255),
                                 password character varying(255),
                                 rut character varying(255) NOT NULL
);




ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_seq OWNER TO postgres;

--
-- Name: order_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_product (
                                      id integer NOT NULL,
                                      order_id integer,
                                      product_id integer,
                                      quantity integer
);


ALTER TABLE public.order_product OWNER TO postgres;

--
-- Name: order_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_product_id_seq OWNER TO postgres;

--
-- Name: order_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_product_id_seq OWNED BY public.order_product.id;


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (age, amount_of_late_payments, consistent_save_history, independent_worker, late_payments, min_cash_on_account, periodic_deposits, recent_withdraws, relation_years_and_balance, working, working_years, id_customer, dad_surname, email, mother_surname, name, password, rut) FROM stdin;
22	0	t	f	f	t	f	f	t	t	5	1	Paez	pato@usach.com	Donoso	Patricio	asdfg67	12345678-9
\.

--
-- Name: customer_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_seq', 51, true);

--
-- PostgreSQL database dump complete
--
