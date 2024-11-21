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
-- Name: loan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan (
                             id_loan bigint NOT NULL,
                             appraisal_certificate oid,
                             business_financial_state oid,
                             business_plan oid,
                             first_home_deed oid,
                             historical_credit oid,
                             income_document oid,
                             remodeling_budget oid,
                             selected_amount integer NOT NULL,
                             selected_loan integer NOT NULL,
                             selected_years integer NOT NULL,
                             request integer,
                             property_value double precision,
                             selected_interest double precision
);


ALTER TABLE public.loan OWNER TO postgres;

--
-- Name: loan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_seq
    AS integer
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_seq OWNER TO postgres;

--
-- Data for Name: loan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan (id_loan, appraisal_certificate, business_financial_state, business_plan, first_home_deed, historical_credit, income_document, remodeling_budget, selected_amount, selected_loan, selected_years, request, property_value, selected_interest) FROM stdin;
1	\N	\N	\N	\N	\N	\N	\N	120000000	1	10	\N	150000000	3.5
\.

--
-- Name: loan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_seq', 601, true);

--
-- PostgreSQL database dump complete
--
