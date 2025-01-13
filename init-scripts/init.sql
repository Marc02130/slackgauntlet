--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

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
-- Name: Channel; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."Channel" (
    id text NOT NULL,
    name text NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Channel" OWNER TO slackgauntlet;

--
-- Name: ChannelUser; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."ChannelUser" (
    id text NOT NULL,
    "channelId" text NOT NULL,
    "userId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChannelUser" OWNER TO slackgauntlet;

--
-- Name: File; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."File" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    url text NOT NULL,
    "fileType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."File" OWNER TO slackgauntlet;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "channelId" text,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "recipientId" text,
    "parentId" text,
    "replyCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Message" OWNER TO slackgauntlet;

--
-- Name: MessageRead; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."MessageRead" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    "channelId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MessageRead" OWNER TO slackgauntlet;

--
-- Name: User; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "profilePicture" text,
    status text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userRole" text DEFAULT 'USER'::text NOT NULL,
    "firstName" text,
    "lastName" text,
    username text NOT NULL
);


ALTER TABLE public."User" OWNER TO slackgauntlet;

--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Channel" (id, name, "isPrivate", "createdAt", "updatedAt") FROM stdin;
cm5oa3klk0002iz40jft8fyk2	General	f	2025-01-08 19:14:32.841	2025-01-08 19:14:43.374
cm5oa4ih70003iz40rpat9b9k	Intelligent Discussions	f	2025-01-08 19:15:16.747	2025-01-08 19:14:46.376
cm5oa57n10004iz40ho2oigvr	Nonsense	f	2025-01-08 19:15:49.357	2025-01-08 19:15:20.457
cm5onpmbe000810adte0cmsjo	Break Room	f	2025-01-09 01:35:36.506	2025-01-09 01:35:36.506
cm5qptuwc00003ej81nq0lbnn	Social	f	2025-01-10 12:10:25.836	2025-01-10 12:10:25.836
\.


--
-- Data for Name: ChannelUser; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."ChannelUser" (id, "channelId", "userId", "joinedAt") FROM stdin;
cm5oa897q0007iz40lqqjqyxi	cm5oa57n10004iz40ho2oigvr	cm5oa7l940006iz40hzzi5gq5	2025-01-08 19:18:11.366
cm5oaa1ut0008iz40nk08agwd	cm5oa4ih70003iz40rpat9b9k	cm5o13d7300013e0ar06t9azd	2025-01-08 19:19:35.141
cm5oaae4n0009iz40l9hqbelt	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	2025-01-08 19:19:51.048
cm5oaap0x000aiz40l1zaa5nb	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	2025-01-08 19:20:05.169
cm5oaaz4f000biz40wiwb0bg0	cm5oa3klk0002iz40jft8fyk2	cm5oa7l940006iz40hzzi5gq5	2025-01-08 19:20:18.255
cm5onpmbe000a10advzcirfoy	cm5onpmbe000810adte0cmsjo	cm5oa6ebx0005iz40qeqhnul5	2025-01-09 01:35:36.506
cm5onpmbe000b10ad11696lu9	cm5onpmbe000810adte0cmsjo	cm5oa7l940006iz40hzzi5gq5	2025-01-09 01:35:36.506
cm5onpmbe000c10ad7256txxa	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	2025-01-09 01:35:36.506
cm5p9gijk0001drkc51ake6a3	cm5oa4ih70003iz40rpat9b9k	cm5oa6ebx0005iz40qeqhnul5	2025-01-09 11:44:23.263
cm5paicc50001133r68eviqqn	cm5oa57n10004iz40ho2oigvr	cm5p9nscv0000xaka1et5q4u2	2025-01-09 12:13:48.149
cm5paiggp0003133r5t4p74fx	cm5oa3klk0002iz40jft8fyk2	cm5p9nscv0000xaka1et5q4u2	2025-01-09 12:13:53.497
cm5q24x3g00013e0oe7gz9tsx	cm5oa3klk0002iz40jft8fyk2	cm5q2444r00003erqvbnton44	2025-01-10 01:07:11.117
cm5qptuwc00023ej8v4vr0a2f	cm5qptuwc00003ej81nq0lbnn	user_2rR8xagJZ4qPdBxSnD0CNs1f8oj	2025-01-10 12:10:25.836
cm5qptuwc00033ej8e4rfioy3	cm5qptuwc00003ej81nq0lbnn	cm5p9nscv0000xaka1et5q4u2	2025-01-10 12:10:25.836
cm5qptuwc00043ej8z3w25cgu	cm5qptuwc00003ej81nq0lbnn	cm5pdjim000003ekmbke9tcym	2025-01-10 12:10:25.836
cm5qptuwc00053ej8qm8oduzv	cm5qptuwc00003ej81nq0lbnn	cm5o13d7300013e0ar06t9azd	2025-01-10 12:10:25.836
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."File" (id, "messageId", url, "fileType", "createdAt") FROM stdin;
cm5ol2v840002ehpt667szph6	cm5ol2v830001ehptq8zxd6cj	https://utfs.io/f/5fae21aa-5150-4c3f-94a4-87fbfe51503c-fiuae4.JPG	JPG	2025-01-09 00:21:55.73
cm5olb9880007ehpt87p4i2ku	cm5olb9880006ehptlidayqfd	https://utfs.io/f/3b403726-9670-4746-a7cc-b15c38bd1463-fiuae4.JPG	JPG	2025-01-09 00:28:27.127
cm5ollfso00023t9beb8bzo4n	cm5ollfso00013t9bq5z72ozj	https://utfs.io/f/4fa5ea5a-bc87-4c6d-9a17-aaf75710a33f-fiuae4.JPG	JPG	2025-01-09 00:36:22.199
cm5om63qb000211mdk59aedeq	cm5om63qb000111md37nhdt9j	https://utfs.io/f/9b7bb702-164f-4159-aec6-c30765be0a30-4o63ls.jpg	jpg	2025-01-09 00:52:26.337
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Message" (id, "channelId", "userId", content, "createdAt", "updatedAt", "recipientId", "parentId", "replyCount") FROM stdin;
cm5oe3tga0000daw4nukh0wgx	\N	cm5o13d7300013e0ar06t9azd	hello	2025-01-08 21:06:42.778	2025-01-08 21:05:37.728	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oe4lbs0001daw473yo1glm	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	nothing but generalities	2025-01-08 21:07:18.904	2025-01-08 21:06:44.743	\N	\N	0
cm5oem6gg0001bj4cx86jdc3f	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	it is the general channel	2025-01-08 21:20:59.441	2025-01-08 21:20:59.441	\N	\N	0
cm5oesyeb0003bj4cgcbeupdn	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	so it makes sense	2025-01-08 21:26:15.587	2025-01-08 21:26:15.587	\N	\N	0
cm5oez8x60001t2kr8gm8emt3	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	try again	2025-01-08 21:31:09.161	2025-01-08 21:31:09.161	\N	\N	0
cm5of6q6q0001bj14cfb54ovv	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	try again again	2025-01-08 21:36:58.127	2025-01-08 21:36:58.127	\N	\N	0
cm5ofhy3m00015q131tfk06wx	\N	cm5o13d7300013e0ar06t9azd	you again?	2025-01-08 21:45:41.601	2025-01-08 21:45:41.601	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5ofjqxf00035q13t31a5w71	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	is this working	2025-01-08 21:47:05.619	2025-01-08 21:47:05.619	\N	\N	0
cm5ofk6g800055q13h88hebdg	\N	cm5o13d7300013e0ar06t9azd	helllllooooo	2025-01-08 21:47:25.737	2025-01-08 21:47:25.737	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5ofmsqc00075q13q42xi95u	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	yes it is	2025-01-08 21:49:27.924	2025-01-08 21:49:27.924	\N	\N	0
cm5ofnosq00095q139jipdn6x	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	I see	2025-01-08 21:50:09.481	2025-01-08 21:50:09.481	\N	\N	0
cm5ofnxf7000b5q13mmmdhq1a	\N	cm5oa6ebx0005iz40qeqhnul5	how about this?	2025-01-08 21:50:20.659	2025-01-08 21:50:20.659	cm5o13d7300013e0ar06t9azd	\N	0
cm5ofo7nv000d5q13u4mx3dn9	\N	cm5o13d7300013e0ar06t9azd	this too!	2025-01-08 21:50:33.932	2025-01-08 21:50:33.932	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5og1gw2000f5q13vqf0qmfw	\N	cm5o13d7300013e0ar06t9azd	need a vaccine	2025-01-08 22:00:52.418	2025-01-08 22:00:52.418	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5og9r4n0001uo97pcqbjt3k	\N	cm5oa6ebx0005iz40qeqhnul5	this?	2025-01-08 22:07:18.934	2025-01-08 22:07:18.934	cm5o13d7300013e0ar06t9azd	\N	0
cm5ogouh80001ulb4wztz5phw	\N	cm5oa6ebx0005iz40qeqhnul5	what?	2025-01-08 22:19:03.116	2025-01-08 22:19:03.116	cm5o13d7300013e0ar06t9azd	\N	0
cm5ohwn2j000114jgmqzsnxou	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 22:53:06.377	2025-01-08 22:53:06.377	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oi0efn000314jghmuyhkgt	\N	cm5oa6ebx0005iz40qeqhnul5		2025-01-08 22:56:01.811	2025-01-08 22:56:01.811	cm5o13d7300013e0ar06t9azd	\N	0
cm5oi140k0001o74hhf0j8tyh	\N	cm5oa6ebx0005iz40qeqhnul5		2025-01-08 22:56:34.965	2025-01-08 22:56:34.965	cm5o13d7300013e0ar06t9azd	\N	0
cm5oi8lo50003o74homwr9wi0	\N	cm5oa6ebx0005iz40qeqhnul5		2025-01-08 23:02:24.437	2025-01-08 23:02:24.437	cm5o13d7300013e0ar06t9azd	\N	0
cm5oi9qkw0005o74hwxhse87r	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:03:17.456	2025-01-08 23:03:17.456	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oidp520007o74hz82mp1d5	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:06:22.214	2025-01-08 23:06:22.214	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oih04k0009o74hw8jr80bh	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:08:56.421	2025-01-08 23:08:56.421	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oir8cl000bo74hbf12coa1	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:16:53.636	2025-01-08 23:16:53.636	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oivwh3000do74htm0s7e2u	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:20:31.525	2025-01-08 23:20:31.525	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oiycym000fo74h848nbslz	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:22:26.205	2025-01-08 23:22:26.205	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oiz59n000ho74hwug2tkvo	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:23:02.888	2025-01-08 23:23:02.888	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oj2eqw0001541lpk2nld02	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:25:35.144	2025-01-08 23:25:35.144	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oj302u0003541lgdfaunni	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:26:02.791	2025-01-08 23:26:02.791	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5oj6v590005541lgz3nzx46	\N	cm5o13d7300013e0ar06t9azd		2025-01-08 23:29:03.02	2025-01-08 23:29:03.02	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5okpwmh0001zz7qmgfeknhk	\N	cm5o13d7300013e0ar06t9azd		2025-01-09 00:11:51.016	2025-01-09 00:11:51.016	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5okso900003zz7q99cqahjm	\N	cm5o13d7300013e0ar06t9azd		2025-01-09 00:14:00.132	2025-01-09 00:14:00.132	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5ol8f6o0004ehptw38p265g	\N	cm5o13d7300013e0ar06t9azd		2025-01-09 00:26:14.879	2025-01-09 00:26:14.879	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5olb9880006ehptlidayqfd	\N	cm5o13d7300013e0ar06t9azd		2025-01-09 00:28:27.127	2025-01-09 00:28:27.127	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5ollfso00013t9bq5z72ozj	\N	cm5oa6ebx0005iz40qeqhnul5		2025-01-09 00:36:22.199	2025-01-09 00:36:22.199	cm5o13d7300013e0ar06t9azd	\N	0
cm5om63qb000111md37nhdt9j	\N	cm5oa6ebx0005iz40qeqhnul5		2025-01-09 00:52:26.337	2025-01-09 00:52:26.337	cm5o13d7300013e0ar06t9azd	\N	0
cm5om6h1z000411md1sgd2q8c	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	hello	2025-01-09 00:52:43.608	2025-01-09 00:52:43.608	\N	\N	0
cm5omah4e000611mdj15ki55h	cm5oa4ih70003iz40rpat9b9k	cm5o13d7300013e0ar06t9azd	first message	2025-01-09 00:55:50.318	2025-01-09 00:55:50.318	\N	\N	0
cm5omb34n000811mdx7xggjwn	\N	cm5oa6ebx0005iz40qeqhnul5	is that an engine?	2025-01-09 00:56:18.838	2025-01-09 00:56:18.838	cm5o13d7300013e0ar06t9azd	\N	0
cm5omcp3f000a11mdevm3nh9e	\N	cm5oa6ebx0005iz40qeqhnul5	test	2025-01-09 00:57:33.964	2025-01-09 00:57:33.964	cm5o13d7300013e0ar06t9azd	\N	0
cm5omd10p000c11mdhvt42hft	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	test	2025-01-09 00:57:49.417	2025-01-09 00:57:49.417	\N	\N	0
cm5omgn4h0001a9sf6ohm7mq6	\N	cm5oa6ebx0005iz40qeqhnul5	test again	2025-01-09 01:00:38.032	2025-01-09 01:00:38.032	cm5o13d7300013e0ar06t9azd	\N	0
cm5onfm4c000110ad1kulii8j	\N	cm5oa6ebx0005iz40qeqhnul5	test	2025-01-09 01:27:49.693	2025-01-09 01:27:49.693	cm5oa7l940006iz40hzzi5gq5	\N	0
cm5onsd6v000e10ad9brkmcoi	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	😉	2025-01-09 01:37:44.646	2025-01-09 01:37:44.646	\N	\N	0
cm5onu1fz000g10adfczpzksu	\N	cm5oa6ebx0005iz40qeqhnul5	😉	2025-01-09 01:39:02.735	2025-01-09 01:39:02.735	cm5oa7l940006iz40hzzi5gq5	\N	0
cm5onzu3t0001kvrw7b28yv2x	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	test	2025-01-09 01:43:33.161	2025-01-09 01:43:33.161	\N	cm5onudtt000i10advuzs5ioy	0
cm5oo5kms0007kvrwtthfuzcx	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	🐯	2025-01-09 01:48:00.82	2025-01-09 01:48:00.82	\N	cm5ol2v830001ehptq8zxd6cj	0
cm5oo39hf0003kvrw77cbte6j	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	😉	2025-01-09 01:46:13.06	2025-01-09 01:46:13.06	\N	cm5onudtt000i10advuzs5ioy	0
cm5paiutq0005133rzgvugs1z	cm5oa3klk0002iz40jft8fyk2	cm5p9nscv0000xaka1et5q4u2	hello	2025-01-09 12:14:12.11	2025-01-09 12:14:12.11	\N	\N	0
cm5oo4dbe0005kvrwxganm1kf	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	📌	2025-01-09 01:47:04.682	2025-01-09 01:47:04.682	\N	cm5onudtt000i10advuzs5ioy	0
cm5onudtt000i10advuzs5ioy	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	😍	2025-01-09 01:39:18.785	2025-01-09 01:47:04.682	\N	\N	3
cm5ooh8hx0009kvrw3iluilnf	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	😃	2025-01-09 01:57:04.963	2025-01-09 01:57:04.963	\N	\N	0
cm5oosrjr000154hc8ae70zia	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	🏈	2025-01-09 02:06:02.871	2025-01-09 02:06:02.871	\N	cm5ol2v830001ehptq8zxd6cj	0
cm5ol2v830001ehptq8zxd6cj	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd		2025-01-09 00:21:55.73	2025-01-09 02:06:02.871	\N	\N	2
cm5pqgjkk00013emkthxa9a60	\N	cm5o13d7300013e0ar06t9azd	does this scroll?	2025-01-09 19:40:18.069	2025-01-09 19:40:18.069	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pqvjaf00013ep4knw62lbe	\N	cm5o13d7300013e0ar06t9azd	you there?	2025-01-09 19:51:57.544	2025-01-09 19:51:57.544	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pqvqot00033ep4w618k4tj	\N	cm5o13d7300013e0ar06t9azd	still?	2025-01-09 19:52:07.133	2025-01-09 19:52:07.133	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pqyq9200053ep4zt1ucwfi	\N	cm5o13d7300013e0ar06t9azd	let's try again	2025-01-09 19:54:26.534	2025-01-09 19:54:26.534	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pr14b900073ep4z8t2x68y	\N	cm5o13d7300013e0ar06t9azd	and again	2025-01-09 19:56:18.069	2025-01-09 19:56:18.069	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pr52vz00013egx2kmbit8f	\N	cm5o13d7300013e0ar06t9azd	hey	2025-01-09 19:59:22.847	2025-01-09 19:59:22.847	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pr7uh700033egxk4z8rz05	\N	cm5o13d7300013e0ar06t9azd	hey hey	2025-01-09 20:01:31.915	2025-01-09 20:01:31.915	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pr9wag00053egxtqsq0m1l	\N	cm5o13d7300013e0ar06t9azd	hey hey hey	2025-01-09 20:03:07.577	2025-01-09 20:03:07.577	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pragyq00073egxiy13twt4	\N	cm5o13d7300013e0ar06t9azd	hey hey hey hey	2025-01-09 20:03:34.37	2025-01-09 20:03:34.37	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5praqgf00093egxu9sxgf0x	\N	cm5o13d7300013e0ar06t9azd	hey hey hey hey HEY	2025-01-09 20:03:46.672	2025-01-09 20:03:46.672	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5prrdy500013efmwcvmsn45	\N	cm5o13d7300013e0ar06t9azd	hey hey hey hey Hey HEy	2025-01-09 20:16:43.613	2025-01-09 20:16:43.613	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5ps2tly00013eul6es7axtg	\N	cm5o13d7300013e0ar06t9azd	hey hey hey hey Hey HEY	2025-01-09 20:25:37.126	2025-01-09 20:25:37.126	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pt46ie00013evrkhmjjdjs	\N	cm5o13d7300013e0ar06t9azd	hey hey hey hey Hey HEY hey	2025-01-09 20:54:40.118	2025-01-09 20:54:40.118	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pu6tn300013e4iqda97fj8	\N	cm5o13d7300013e0ar06t9azd	hey	2025-01-09 21:24:43.022	2025-01-09 21:24:43.022	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pu71t200033e4iockr5tct	\N	cm5o13d7300013e0ar06t9azd	hey	2025-01-09 21:24:53.606	2025-01-09 21:24:53.606	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pug36700013etid24myd8j	\N	cm5o13d7300013e0ar06t9azd	hey	2025-01-09 21:31:55.279	2025-01-09 21:31:55.279	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pulres00013ep3pn8g3wma	\N	cm5o13d7300013e0ar06t9azd	look	2025-01-09 21:36:19.972	2025-01-09 21:36:19.972	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5puwuso00013eba32olgc5q	cm5oa3klk0002iz40jft8fyk2	cm5o13d7300013e0ar06t9azd	hey channel	2025-01-09 21:44:57.576	2025-01-09 21:44:57.576	\N	\N	0
cm5pv424900013en58vserw14	cm5onpmbe000810adte0cmsjo	cm5o13d7300013e0ar06t9azd	😍	2025-01-09 21:50:33.657	2025-01-09 21:50:33.657	\N	\N	0
cm5pv4ewa00053en5mag89y8n	\N	cm5o13d7300013e0ar06t9azd	😍	2025-01-09 21:50:50.219	2025-01-09 21:50:50.219	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pvnu5t00013eybqdw1ctof	\N	cm5o13d7300013e0ar06t9azd	😊	2025-01-09 22:05:56.464	2025-01-09 22:05:56.464	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5pvspzw00053eybm7r5hrbd	cm5oa4ih70003iz40rpat9b9k	cm5o13d7300013e0ar06t9azd	second message too	2025-01-09 22:09:44.348	2025-01-09 22:09:44.348	\N	\N	0
cm5pxe5w100013eb4wab7broo	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	we are done	2025-01-09 22:54:24.337	2025-01-09 22:54:24.337	\N	\N	0
cm5pxeoqk00063eb4ry9ftnop	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	look	2025-01-09 22:54:48.765	2025-01-09 22:54:48.765	\N	\N	0
cm5q25bu000033e0o0ym2265y	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	hello mike	2025-01-10 01:07:30.215	2025-01-10 01:07:30.215	\N	\N	0
cm5q2clim00013elz6p3ebwuq	cm5oa3klk0002iz40jft8fyk2	cm5oa6ebx0005iz40qeqhnul5	hello mike	2025-01-10 01:13:09.359	2025-01-10 01:13:09.359	\N	\N	0
cm5qm5p6a00073elzw36tnch0	cm5oa3klk0002iz40jft8fyk2	cm5q2444r00003erqvbnton44	new message	2025-01-10 10:27:39.825	2025-01-10 10:27:39.825	\N	\N	0
cm5qmabkh00013ecl02rp4353	\N	cm5q2444r00003erqvbnton44	hello	2025-01-10 10:31:15.473	2025-01-10 10:31:15.473	cm5o13d7300013e0ar06t9azd	\N	0
cm5qmbq5x00033eclkvgy7am6	\N	cm5q2444r00003erqvbnton44	hello	2025-01-10 10:32:21.044	2025-01-10 10:32:21.044	cm5o13d7300013e0ar06t9azd	\N	0
cm5qmgav900013e58vcnci74t	\N	cm5q2444r00003erqvbnton44	hey	2025-01-10 10:35:54.501	2025-01-10 10:35:54.501	cm5oa6ebx0005iz40qeqhnul5	\N	0
cm5qpu0s300073ej8kipvwu86	cm5qptuwc00003ej81nq0lbnn	user_2rR8xagJZ4qPdBxSnD0CNs1f8oj	welcome	2025-01-10 12:10:33.459	2025-01-10 12:10:33.459	\N	\N	0
\.


--
-- Data for Name: MessageRead; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."MessageRead" (id, "messageId", "userId", "channelId", "createdAt", "updatedAt") FROM stdin;
cm5puwusu00033ebagu04sk83	cm5puwuso00013eba32olgc5q	cm5oa7l940006iz40hzzi5gq5	cm5oa3klk0002iz40jft8fyk2	2025-01-09 21:44:57.583	2025-01-09 21:44:57.583
cm5puwusu00043eba7zj4mazj	cm5puwuso00013eba32olgc5q	cm5p9nscv0000xaka1et5q4u2	cm5oa3klk0002iz40jft8fyk2	2025-01-09 21:44:57.583	2025-01-09 21:44:57.583
cm5pv424g00033en5go40c5g6	cm5pv424900013en58vserw14	cm5oa7l940006iz40hzzi5gq5	cm5onpmbe000810adte0cmsjo	2025-01-09 21:50:33.664	2025-01-09 21:50:33.664
cm5pxe5w900033eb4ua4hbpk3	cm5pxe5w100013eb4wab7broo	cm5oa7l940006iz40hzzi5gq5	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:24.345	2025-01-09 22:54:24.345
cm5pxe5w900043eb441z79jex	cm5pxe5w100013eb4wab7broo	cm5p9nscv0000xaka1et5q4u2	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:24.345	2025-01-09 22:54:24.345
cm5pxeoqo00083eb4cq6iwhux	cm5pxeoqk00063eb4ry9ftnop	cm5oa7l940006iz40hzzi5gq5	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:48.769	2025-01-09 22:54:48.769
cm5pxeoqo00093eb4k19zoj8e	cm5pxeoqk00063eb4ry9ftnop	cm5p9nscv0000xaka1et5q4u2	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:48.769	2025-01-09 22:54:48.769
cm5pxe5w900023eb4qsdwhoc7	cm5pxe5w100013eb4wab7broo	cm5o13d7300013e0ar06t9azd	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:24.345	2025-01-09 22:54:59.094
cm5pxeoqo00073eb44mgcbgw4	cm5pxeoqk00063eb4ry9ftnop	cm5o13d7300013e0ar06t9azd	cm5oa3klk0002iz40jft8fyk2	2025-01-09 22:54:48.769	2025-01-09 22:54:59.094
cm5q2cliu00023elzc855v1ht	cm5q2clim00013elz6p3ebwuq	cm5o13d7300013e0ar06t9azd	cm5oa3klk0002iz40jft8fyk2	2025-01-10 01:13:09.367	2025-01-10 01:13:09.367
cm5q2cliv00033elzqvz77bih	cm5q2clim00013elz6p3ebwuq	cm5oa7l940006iz40hzzi5gq5	cm5oa3klk0002iz40jft8fyk2	2025-01-10 01:13:09.367	2025-01-10 01:13:09.367
cm5q2cliv00043elzbwislv4p	cm5q2clim00013elz6p3ebwuq	cm5p9nscv0000xaka1et5q4u2	cm5oa3klk0002iz40jft8fyk2	2025-01-10 01:13:09.367	2025-01-10 01:13:09.367
cm5qm5p6m00083elzfzb0d1lb	cm5qm5p6a00073elzw36tnch0	cm5o13d7300013e0ar06t9azd	cm5oa3klk0002iz40jft8fyk2	2025-01-10 10:27:39.838	2025-01-10 10:27:39.838
cm5qm5p6m000a3elzqm1c6zhl	cm5qm5p6a00073elzw36tnch0	cm5oa7l940006iz40hzzi5gq5	cm5oa3klk0002iz40jft8fyk2	2025-01-10 10:27:39.838	2025-01-10 10:27:39.838
cm5qm5p6m000b3elzgir5byby	cm5qm5p6a00073elzw36tnch0	cm5p9nscv0000xaka1et5q4u2	cm5oa3klk0002iz40jft8fyk2	2025-01-10 10:27:39.838	2025-01-10 10:27:39.838
cm5qpu0s800083ej8l88w7ve2	cm5qpu0s300073ej8kipvwu86	cm5p9nscv0000xaka1et5q4u2	cm5qptuwc00003ej81nq0lbnn	2025-01-10 12:10:33.465	2025-01-10 12:10:33.465
cm5qpu0s800093ej8pr8qm8yz	cm5qpu0s300073ej8kipvwu86	cm5pdjim000003ekmbke9tcym	cm5qptuwc00003ej81nq0lbnn	2025-01-10 12:10:33.465	2025-01-10 12:10:33.465
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."User" (id, email, "profilePicture", status, "createdAt", "updatedAt", "userRole", "firstName", "lastName", username) FROM stdin;
cm5o13d7300013e0ar06t9azd	marc.breneiser@gauntletai.com	\N	busy	2025-01-08 15:02:26.703	2025-01-09 15:10:33.722	USER	Marc	Gauntlet	marcdg
cm5oa7l940006iz40hzzi5gq5	mbreneiser@gmail.com	\N	available	2025-01-08 19:17:40.313	2025-01-09 15:10:33.722	USER	Marc	MbGmail	mbg
cm5p9nscv0000xaka1et5q4u2	sneer-chip-running@duck.com	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yckxFS1BBelE0U003YXp0UjhPcUNTeDlDZ1giLCJyaWQiOiJ1c2VyXzJyT0dJb3pGU2RCbm1XUUt0NlQxMmthT2s5bSJ9	available	2025-01-09 11:50:02.575	2025-01-09 15:10:33.722	USER	Duck	One	duck1
cm5pdjim000003ekmbke9tcym	handling-nag-duvet@duck.com	\N	available	2025-01-09 13:38:41.784	2025-01-09 15:10:33.722	USER	Duck	Two	duck2
cm5oa6ebx0005iz40qeqhnul5	marc.breneiser@gmail.com	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yckxFS1BBelE0U003YXp0UjhPcUNTeDlDZ1giLCJyaWQiOiJ1c2VyXzJyTUh5Qm5JUTk5a1I0d1ZoMnY5WVd4T2NiVSJ9	available	2025-01-08 19:16:44.685	2025-01-09 16:30:58.295	ADMIN	Marc	Gmail	marcg
cm5q2444r00003erqvbnton44	wreath-chant-rind@duck.com	\N	available	2025-01-10 01:06:33.579	2025-01-10 10:35:32.498	USER	Mike	Smaith	mikes
user_29w83sxmDNGwOuEthce5gg56FcC	example@example.org	https://www.gravatar.com/avatar?d=mp	\N	2025-01-10 11:54:30.738	2025-01-10 11:54:30.738	USER	Example	Example	useruser_29w
user_2rR3ZQAma99mxShlb6CLS6z7Ztx	such-woof-episode@duck.com	https://www.gravatar.com/avatar?d=mp	\N	2025-01-10 11:57:49.862	2025-01-10 11:57:49.862	USER	Marc	Six	marcs
user_2rR8xagJZ4qPdBxSnD0CNs1f8oj	junkie-quail-saint@duck.com	https://www.gravatar.com/avatar?d=mp	available	2025-01-10 12:06:16.227	2025-01-10 12:22:52.853	USER	Marc	Eighty	marce
\.


--
-- Name: ChannelUser ChannelUser_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."ChannelUser"
    ADD CONSTRAINT "ChannelUser_pkey" PRIMARY KEY (id);


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: MessageRead MessageRead_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."MessageRead"
    ADD CONSTRAINT "MessageRead_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: ChannelUser_channelId_userId_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "ChannelUser_channelId_userId_key" ON public."ChannelUser" USING btree ("channelId", "userId");


--
-- Name: MessageRead_messageId_userId_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "MessageRead_messageId_userId_key" ON public."MessageRead" USING btree ("messageId", "userId");


--
-- Name: MessageRead_userId_channelId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "MessageRead_userId_channelId_idx" ON public."MessageRead" USING btree ("userId", "channelId");


--
-- Name: MessageRead_userId_messageId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "MessageRead_userId_messageId_idx" ON public."MessageRead" USING btree ("userId", "messageId");


--
-- Name: Message_channelId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "Message_channelId_idx" ON public."Message" USING btree ("channelId");


--
-- Name: Message_recipientId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "Message_recipientId_idx" ON public."Message" USING btree ("recipientId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: ChannelUser ChannelUser_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."ChannelUser"
    ADD CONSTRAINT "ChannelUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChannelUser ChannelUser_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."ChannelUser"
    ADD CONSTRAINT "ChannelUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: File File_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageRead MessageRead_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."MessageRead"
    ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageRead MessageRead_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."MessageRead"
    ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

