--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

SET session_replication_role = 'replica';
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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: slackgauntlet
--

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO slackgauntlet;

ALTER SCHEMA public OWNER TO slackgauntlet;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Channel; Type: TABLE; Schema: public; Owner: slackgauntlet
--

SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%Channel%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%ChannelUser%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%File%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%Message%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%MessageRead%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%User%';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query LIKE '%_prisma_migrations%';

DROP TABLE IF EXISTS "ChannelUser", "File", "MessageRead", "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "Channel", "User" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;

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
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "channelId" text,
    "recipientId" text,
    "parentId" text,
    "replyCount" integer DEFAULT 0 NOT NULL,
    "isAIResponse" boolean DEFAULT false NOT NULL
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
    username text NOT NULL,
    "firstName" text,
    "lastName" text,
    email text NOT NULL,
    "profilePicture" text,
    "userRole" text DEFAULT 'USER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status text,
    "statusMessage" text,
    "useAIResponse" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO slackgauntlet;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."_prisma_migrations" (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO slackgauntlet;



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."User" (id, username, "firstName", "lastName", email, "profilePicture", "userRole", "createdAt", "updatedAt", status, "statusMessage", "useAIResponse") FROM stdin;
cm5wcl72500023euyb67ri0aj	ducko	Duck	One	sneer-chip-running@duck.com	\N	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.304	\N	\N	f
cm5wcl72600033euyoz4hsvqn	duckt	Duck	Two	handling-nag-duvet@duck.com	\N	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.305	\N	\N	f
cm5wcp81a00053euyt3p32nhe	marcai	Marc	Gai	marc.breneiser@gauntletai.com	\N	USER	2025-01-14 10:49:31.63	2025-01-14 20:39:26.845	available	\N	f
cm5wcp81900043euykpvmf9pf	marcg	Marc	B	marc.breneiser@gmail.com	\N	USER	2025-01-14 10:49:31.63	2025-01-14 20:57:18.98	available	\N	f
cm5wcp81a00063euywix6zte8	billw	Bill	Williams	ridden-keep-robin@duck.com	\N	USER	2025-01-14 10:49:31.63	2025-01-15 02:52:26.789	busy		t
\.



--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Channel" (id, name, "isPrivate", "createdAt", "updatedAt") FROM stdin;
cm5wd0ign00003euc9t8mukj9	All Company	f	2025-01-14 10:58:18.359	2025-01-14 10:58:18.359
cm5wgbes000003ems4aeblqp1	Intelligent Chat	f	2025-01-14 12:30:45.648	2025-01-14 12:30:45.648
\.


--
-- Data for Name: ChannelUser; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."ChannelUser" (id, "channelId", "userId", "joinedAt") FROM stdin;
cm5wd0ign00023eucdgorvcz5	cm5wd0ign00003euc9t8mukj9	cm5wcp81a00063euywix6zte8	2025-01-14 10:58:18.359
cm5wd0ign00033eucmd8zy68j	cm5wd0ign00003euc9t8mukj9	cm5wcl72500023euyb67ri0aj	2025-01-14 10:58:18.359
cm5wd0ign00043eucy88j6rob	cm5wd0ign00003euc9t8mukj9	cm5wcl72600033euyoz4hsvqn	2025-01-14 10:58:18.359
cm5wd0ign00053euc2oz9feku	cm5wd0ign00003euc9t8mukj9	cm5wcp81a00053euyt3p32nhe	2025-01-14 10:58:18.359
cm5wd0ign00063eucpoj7gplu	cm5wd0ign00003euc9t8mukj9	cm5wcp81900043euykpvmf9pf	2025-01-14 10:58:18.359
cm5wgbes000023emsqmye7p4r	cm5wgbes000003ems4aeblqp1	cm5wcp81a00063euywix6zte8	2025-01-14 12:30:45.648
cm5wgbes000033emsfn7bir8o	cm5wgbes000003ems4aeblqp1	cm5wcp81a00053euyt3p32nhe	2025-01-14 12:30:45.648
cm5wgbes000043ems46o3a2bh	cm5wgbes000003ems4aeblqp1	cm5wcp81900043euykpvmf9pf	2025-01-14 12:30:45.648
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Message" (id, content, "createdAt", "updatedAt", "userId", "channelId", "recipientId", "parentId", "replyCount", "isAIResponse") FROM stdin;
cm5webycs00013e1i7rjauakz	Hey, how are you?	2025-01-14 11:35:11.788	2025-01-14 11:35:11.788	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5wgbzzl00063emsjb5xo3cp	Can you help me with the project?	2025-01-14 12:31:13.136	2025-01-14 12:31:13.136	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f
cm5wgd9pj000a3emso2obyvdc	I'm good, thanks! How about you?	2025-01-14 12:32:12.389	2025-01-14 12:32:12.389	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5wgdrib000g3ems2md66768	Sure setup a meeting to discuss	2025-01-14 12:32:35.459	2025-01-14 12:32:35.459	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5wgeohz000k3emsaqo1dwnt	Do you to in the project meeting with marcai?	2025-01-14 12:33:18.214	2025-01-14 12:33:18.214	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	f
cm5wkt15g00013e5myktj2e6a	A new chat, without all all the nonsense!	2025-01-14 14:36:26.259	2025-01-14 14:36:26.259	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5wkvaka00053e5m2ukcr7oz	Dis you setup a meeting?	2025-01-14 14:38:11.769	2025-01-14 14:38:11.769	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5wkyo9r00013edin5wpo4as	What if someone posts nonsense?	2025-01-14 14:40:49.503	2025-01-14 14:40:49.503	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5wli7m000013e16pvnmz5hm	Did you setup the meeting, I did not get an invite?	2025-01-14 14:56:01.032	2025-01-14 14:56:01.032	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5wmgfcn00013elpz3majupx	hey, I'm busy	2025-01-14 15:22:37.367	2025-01-14 15:22:37.367	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5wmlqd500053elpfxordl7j	still very busy	2025-01-14 15:26:44.921	2025-01-14 15:26:44.921	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5wy1ca400013eoyc21mt3nl	Bill schedule the meeting for tomorrow in Backbay	2025-01-14 20:46:48.94	2025-01-14 20:46:48.94	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5wz0c2x00013ecniuxk25cl	Tired, it has been long day	2025-01-14 21:14:01.64	2025-01-14 21:14:01.64	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5x02vgw00013e7lttaj1re3	whoa!	2025-01-14 21:43:59.696	2025-01-14 21:43:59.696	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5x06mcl00063e7lkmzihju5	a great dog	2025-01-14 21:46:54.501	2025-01-14 21:46:54.501	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5x0fpws00013egyil9lm9lo	A noble beast	2025-01-14 21:53:59.019	2025-01-14 21:53:59.019	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f
cm5x0xo4g00053egywxcb3hea	bad fall	2025-01-14 22:07:56.504	2025-01-14 22:07:56.504	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5x4nhqy00013ewrdasrkmld	worse	2025-01-14 23:52:00.154	2025-01-14 23:52:00.154	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5x8p6ix00013e7utqbwhhm6		2025-01-15 01:45:17.385	2025-01-15 01:45:17.385	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5x9ipfx00013e4q48cl35vo	The picture in the message does not make sense	2025-01-15 02:08:14.924	2025-01-15 02:08:14.924	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5x9nala00073e4q4au3yi5a	stop the nonsense messages	2025-01-15 02:11:48.959	2025-01-15 02:11:48.959	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5x9oxqt00093e4qyso9f90b	stop the nonsense messages	2025-01-15 02:13:05.619	2025-01-15 02:13:05.619	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f
cm5x9s0cy00013e8kzk6khj0i	Bill schedule the meeting for tomorrow in Backbay	2025-01-15 02:15:28.977	2025-01-15 02:15:28.977	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f
cm5x9xex600053e8ku303womt	Bill schedule the meeting for tomorrow in Backbay	2025-01-15 02:19:41.13	2025-01-15 02:19:41.13	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f
cm5x9y09700093e8kb5t48vvr	hey everyone!	2025-01-15 02:20:08.779	2025-01-15 02:20:08.779	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5xa1p5o00013eix6rogvx9m	check this out	2025-01-15 02:23:01.021	2025-01-15 02:23:01.021	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5xas2pi00013eps1a0oohjl	what?	2025-01-15 02:43:31.638	2025-01-15 02:43:31.638	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xb32jt00053epsi7nisqz3	what?	2025-01-15 02:52:04.647	2025-01-15 02:52:04.647	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xb3pir00093epsom8cq7yj	I said what?	2025-01-15 02:52:34.419	2025-01-15 02:52:34.419	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xb5rx2000d3epsrj7ry9vr	what?	2025-01-15 02:54:10.838	2025-01-15 02:54:10.838	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xb831l000h3epsw3p90add	are you there?	2025-01-15 02:55:58.569	2025-01-15 02:55:58.569	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xbbxdq000l3epsm3cksh0e	I am going home	2025-01-15 02:58:57.854	2025-01-15 02:58:57.854	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xbe7ys000p3eps26b9dc0k	where is the meeting?	2025-01-15 03:00:44.885	2025-01-15 03:00:44.885	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f
cm5xbef38000t3epszcgs7fpe	[AI Response] Hello [Recipient’s Name],\n\nThank you for reaching out. I am currently away and unable to attend the meeting. Please proceed as planned, and feel free to update me on any important developments afterward.\n\nBest regards,  \nBill W.	2025-01-15 03:00:54.116	2025-01-15 03:00:54.116	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t
cm5xbj4rg000v3epsprgkxci5	nothing makes sense	2025-01-15 03:04:34.012	2025-01-15 03:04:34.012	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
cm5xblsrf00113epskm4m9sjr	more so today	2025-01-15 03:06:38.425	2025-01-15 03:06:38.425	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f
\.


--
-- Data for Name: MessageRead; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."MessageRead" (id, "messageId", "userId", "channelId", "createdAt", "updatedAt") FROM stdin;
cm5webycz00023e1inl4vmt3x	cm5webycs00013e1i7rjauakz	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-14 11:35:11.795	2025-01-14 11:35:11.795
cm5webycz00033e1ikmn867zr	cm5webycs00013e1i7rjauakz	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-14 11:35:11.795	2025-01-14 11:35:11.795
cm5wgd9po000c3emsnn4k2hqm	cm5wgd9pj000a3emso2obyvdc	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wgd9po000d3emsdsxrt52a	cm5wgd9pj000a3emso2obyvdc	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wkt15q00033e5mfpeznkf2	cm5wkt15g00013e5myktj2e6a	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 14:36:26.271	2025-01-14 14:36:26.271
cm5wkyoa300033edijt9jz2xu	cm5wkyo9r00013edin5wpo4as	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 14:40:49.516	2025-01-14 14:40:49.516
cm5wmgfcx00033elpbnjnt1lp	cm5wmgfcn00013elpz3majupx	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 15:22:37.377	2025-01-14 15:22:37.377
cm5wmlqdg00073elp0io03ozq	cm5wmlqd500053elpfxordl7j	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 15:26:44.933	2025-01-14 15:26:44.933
cm5wz0c3a00033ecnfaoq85xt	cm5wz0c2x00013ecniuxk25cl	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-14 21:14:01.654	2025-01-14 21:14:01.654
cm5wz0c3a00043ecnwyehif1j	cm5wz0c2x00013ecniuxk25cl	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-14 21:14:01.654	2025-01-14 21:14:01.654
cm5wz0c3a00053ecnr0w66rzj	cm5wz0c2x00013ecniuxk25cl	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-14 21:14:01.654	2025-01-14 21:14:01.654
cm5x02vh500043e7la2unpls3	cm5x02vgw00013e7lttaj1re3	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 21:43:59.706	2025-01-14 21:43:59.706
cm5x0i58x00033egyettnp0kj	cm5x0fpws00013egyil9lm9lo	cm5wcp81a00053euyt3p32nhe	\N	2025-01-14 21:55:52.207	2025-01-14 21:55:52.207
cm5x0xo7a00063egy104fxor2	cm5x0xo4g00053egywxcb3hea	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	2025-01-14 22:07:56.609	2025-01-14 22:07:56.609
cm5x0xo7a00073egybe5bnyaa	cm5x0xo4g00053egywxcb3hea	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 22:07:56.609	2025-01-14 22:07:56.609
cm5x4nhr900033ewrmt2o7n3z	cm5x4nhqy00013ewrdasrkmld	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	2025-01-14 23:52:00.165	2025-01-14 23:52:00.165
cm5x4nhr900043ewr1agptosm	cm5x4nhqy00013ewrdasrkmld	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 23:52:00.165	2025-01-14 23:52:00.165
cm5x8p6j500033e7uzi9yele9	cm5x8p6ix00013e7utqbwhhm6	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 01:45:17.393	2025-01-15 01:45:17.393
cm5x8p6j500043e7u7d33mnv7	cm5x8p6ix00013e7utqbwhhm6	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 01:45:17.393	2025-01-15 01:45:17.393
cm5x8p6j500053e7ux8tbk6h6	cm5x8p6ix00013e7utqbwhhm6	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 01:45:17.393	2025-01-15 01:45:17.393
cm5x9ipgc00023e4q4sf16a4m	cm5x9ipfx00013e4q48cl35vo	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:08:14.94	2025-01-15 02:08:14.94
cm5x9ipgc00033e4qf28blceb	cm5x9ipfx00013e4q48cl35vo	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:08:14.94	2025-01-15 02:08:14.94
cm5x9ipgc00043e4qikptn8fd	cm5x9ipfx00013e4q48cl35vo	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:08:14.94	2025-01-15 02:08:14.94
cm5x9p9sp000a3e4q4sqkzc09	cm5x9oxqt00093e4qyso9f90b	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	2025-01-15 02:13:21.219	2025-01-15 02:13:21.219
cm5x9p9sp000b3e4qn5eqvdla	cm5x9oxqt00093e4qyso9f90b	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-15 02:13:21.219	2025-01-15 02:13:21.219
cm5x9s0d700033e8kwov53cbb	cm5x9s0cy00013e8kzk6khj0i	cm5wcp81a00053euyt3p32nhe	\N	2025-01-15 02:15:28.988	2025-01-15 02:15:28.988
cm5x9xey500073e8kqdp5o7rd	cm5x9xex600053e8ku303womt	cm5wcp81a00053euyt3p32nhe	\N	2025-01-15 02:19:41.165	2025-01-15 02:19:41.165
cm5x9y12f000a3e8kp7dc3mmf	cm5x9y09700093e8kb5t48vvr	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:20:09.831	2025-01-15 02:20:09.831
cm5x9y12f000b3e8k2hg03763	cm5x9y09700093e8kb5t48vvr	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:20:09.831	2025-01-15 02:20:09.831
cm5x9y12f000c3e8k0u3d1w1r	cm5x9y09700093e8kb5t48vvr	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:20:09.831	2025-01-15 02:20:09.831
cm5xa1qis00033eixcxcdme1i	cm5xa1p5o00013eix6rogvx9m	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:23:02.788	2025-01-15 02:23:02.788
cm5xa1qis00043eixqlumbeqw	cm5xa1p5o00013eix6rogvx9m	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:23:02.788	2025-01-15 02:23:02.788
cm5xa1qis00053eix85ayxb37	cm5xa1p5o00013eix6rogvx9m	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 02:23:02.788	2025-01-15 02:23:02.788
cm5xas2po00033epso3r2h8jj	cm5xas2pi00013eps1a0oohjl	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:43:31.645	2025-01-15 02:43:31.645
cm5xb32jx00073epsogh2gttl	cm5xb32jt00053epsi7nisqz3	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:52:04.653	2025-01-15 02:52:04.653
cm5xb3piw000b3epsf8ydye09	cm5xb3pir00093epsom8cq7yj	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:52:34.425	2025-01-15 02:52:34.425
cm5xb5rx7000f3epsqb8qrzm0	cm5xb5rx2000d3epsrj7ry9vr	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:54:10.843	2025-01-15 02:54:10.843
cm5xb831r000j3epsutnby0zh	cm5xb831l000h3epsw3p90add	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:55:58.575	2025-01-15 02:55:58.575
cm5xbbxdw000n3epsxvjepqf9	cm5xbbxdq000l3epsm3cksh0e	cm5wcp81a00063euywix6zte8	\N	2025-01-15 02:58:57.861	2025-01-15 02:58:57.861
cm5xbe7yw000r3epspgmpps6z	cm5xbe7ys000p3eps26b9dc0k	cm5wcp81a00063euywix6zte8	\N	2025-01-15 03:00:44.889	2025-01-15 03:00:44.889
cm5xbj5wd000x3epsd8drtblr	cm5xbj4rg000v3epsprgkxci5	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:04:35.485	2025-01-15 03:04:35.485
cm5xbj5wd000y3epsg3sqtlnz	cm5xbj4rg000v3epsprgkxci5	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:04:35.485	2025-01-15 03:04:35.485
cm5xbj5wd000z3epscy081afp	cm5xbj4rg000v3epsprgkxci5	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:04:35.485	2025-01-15 03:04:35.485
cm5xbltlz00123epsuxrgkzde	cm5xblsrf00113epskm4m9sjr	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:06:39.527	2025-01-15 03:06:39.527
cm5xbltlz00133epsjh33jw8i	cm5xblsrf00113epskm4m9sjr	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:06:39.527	2025-01-15 03:06:39.527
cm5xbltlz00143eps4qhbu3vz	cm5xblsrf00113epskm4m9sjr	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:06:39.527	2025-01-15 03:06:39.527
cm5xbltlz00153epsdkpgulz5	cm5xblsrf00113epskm4m9sjr	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	2025-01-15 03:06:39.527	2025-01-15 03:06:39.527
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."File" (id, "messageId", url, "fileType", "createdAt") FROM stdin;
cm5x02vgw00023e7lslfj6p4y	cm5x02vgw00013e7lttaj1re3	https://utfs.io/f/776e27ea-02c6-4c9d-88d9-9135878d0711-4n443s.png	png	2025-01-14 21:43:59.696
cm5x06mcl00073e7lxrzzmw0t	cm5x06mcl00063e7lkmzihju5	https://utfs.io/f/d0b4b4af-134f-4130-96ae-091816e6975e-7vrju8.png	png	2025-01-14 21:46:54.501
cm5x4nhqy00023ewra3h317pa	cm5x4nhqy00013ewrdasrkmld	https://utfs.io/f/845948f8-43b4-4e56-9365-a294e043ef85-q1fsof.png	png	2025-01-14 23:52:00.154
cm5x8p6ix00023e7u4ginbow7	cm5x8p6ix00013e7utqbwhhm6	https://utfs.io/f/0435b656-c82d-44d8-a2ff-03bb4bbe2464-m26sw9.png	png	2025-01-15 01:45:17.385
cm5xa1p5o00023eixflo70kat	cm5xa1p5o00013eix6rogvx9m	https://utfs.io/f/034dfc7d-a022-4fbb-b857-7be0fae8fcff-kqfbhg.png	png	2025-01-15 02:23:01.021
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
14d74ed9-e121-4121-b548-73f7050fbfc7	891688218214e9d53a6db49144d14b26f224d15dfcd6876e6302bfe869d8ffd3	2025-01-14 05:43:48.924343-05	20250114104348_user_status	\N	\N	2025-01-14 05:43:48.82898-05	1
1f0e6fce-e89d-498e-bdf5-bbbb36ea9547	ab8f3dcebd564f31b2f5d0edc9dc33b28e1526bd18f9f87146997ad02b802f38	2025-01-14 07:23:58.385319-05	20250114122357_status_updates	\N	\N	2025-01-14 07:23:58.374441-05	1
9ccc529e-956a-4df6-919f-3bccbab05dda	bc4fef9badea13b0de7e8bf1d2fe16e5d2a4ebf53513efe07791b931aa8800a6	2025-01-14 11:35:36.990976-05	20250114162945_status_updates	\N	\N	2025-01-14 11:35:36.985558-05	1
b52586b6-aac0-461d-9050-9f86b00bc24d	db680656dcc1753e1b8c492c2241f666537073e5aff106565647f413c99d8b32	2025-01-14 11:35:58.622058-05	20250114163537_status_updates	\N	\N	2025-01-14 11:35:58.614737-05	1
b385983b-0c2a-443f-a6d2-4533a344fe7e	196a3d7e6031e24f1300dd1447f3edafd54e4be61e90587e812cdc3da97f81cd	2025-01-14 15:43:17.695914-05	20250114204133_embed	\N	\N	2025-01-14 15:43:17.687709-05	1
40d27f8c-a60b-4785-8870-3e72968c0ddf	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-01-14 21:41:07.817083-05	20250114204318_embed	\N	\N	2025-01-14 21:41:07.813755-05	1
65ddcaf5-5206-4a81-9820-730f0b51f658	7f22ee2fce54199bb59e0165c9781bb4dd3e80e0b36617f5dacf4f1b4ed430cb	2025-01-14 21:41:18.794421-05	20250115024118_respond	\N	\N	2025-01-14 21:41:18.788091-05	1
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
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: slackgauntlet
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;

SET session_replication_role = 'origin';

--
-- PostgreSQL database dump complete
--

