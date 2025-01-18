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
-- Name: AIProofingSettings; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AIProofingSettings" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "proofingMode" text DEFAULT 'none'::text NOT NULL,
    "autoAcceptChanges" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "checkGrammar" boolean DEFAULT true NOT NULL,
    "checkTone" boolean DEFAULT true NOT NULL,
    "checkClarity" boolean DEFAULT true NOT NULL,
    "checkSensitivity" boolean DEFAULT true NOT NULL,
    "preferredTone" text,
    formality integer DEFAULT 5 NOT NULL
);


ALTER TABLE public."AIProofingSettings" OWNER TO slackgauntlet;

--
-- Name: Avatar; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."Avatar" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    description text,
    personality text DEFAULT 'helpful'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "contextLimit" integer DEFAULT 10 NOT NULL,
    temperature double precision DEFAULT 0.7 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    settings jsonb
);


ALTER TABLE public."Avatar" OWNER TO slackgauntlet;

--
-- Name: AvatarAnalytics; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AvatarAnalytics" (
    id text NOT NULL,
    "avatarId" text NOT NULL,
    "userId" text NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL,
    "eventType" text NOT NULL,
    metadata jsonb NOT NULL
);


ALTER TABLE public."AvatarAnalytics" OWNER TO slackgauntlet;

--
-- Name: AvatarConversation; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AvatarConversation" (
    id text NOT NULL,
    "avatarId" text NOT NULL,
    "userId" text NOT NULL,
    "messageId" text NOT NULL,
    response text NOT NULL,
    context jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    embedding jsonb,
    "relevanceScore" double precision,
    "isMemoryContext" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."AvatarConversation" OWNER TO slackgauntlet;

--
-- Name: AvatarDocument; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AvatarDocument" (
    id text NOT NULL,
    "avatarId" text NOT NULL,
    name text NOT NULL,
    content text NOT NULL,
    "fileUrl" text,
    "mimeType" text NOT NULL,
    "vectorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    embedding jsonb
);


ALTER TABLE public."AvatarDocument" OWNER TO slackgauntlet;

--
-- Name: AvatarMetrics; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AvatarMetrics" (
    id text NOT NULL,
    "avatarId" text NOT NULL,
    "userId" text NOT NULL,
    "messageLength" integer NOT NULL,
    "responseLength" integer NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AvatarMetrics" OWNER TO slackgauntlet;

--
-- Name: AvatarPerformance; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."AvatarPerformance" (
    id text NOT NULL,
    "avatarId" text NOT NULL,
    "latencyMs" bigint NOT NULL,
    "tokensUsed" integer NOT NULL,
    "cacheHit" boolean NOT NULL,
    status text NOT NULL,
    "errorType" text,
    "timestamp" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AvatarPerformance" OWNER TO slackgauntlet;

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
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "channelId" text,
    "recipientId" text,
    "parentId" text,
    "replyCount" integer DEFAULT 0 NOT NULL,
    "isAIResponse" boolean DEFAULT false NOT NULL,
    embedding jsonb
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
    status text,
    "statusMessage" text,
    "useAIResponse" boolean DEFAULT false NOT NULL,
    "userRole" text DEFAULT 'USER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO slackgauntlet;

--
-- Name: UserAction; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public."UserAction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserAction" OWNER TO slackgauntlet;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: slackgauntlet
--

CREATE TABLE public._prisma_migrations (
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
-- Data for Name: AIProofingSettings; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AIProofingSettings" (id, "userId", "proofingMode", "autoAcceptChanges", "createdAt", "updatedAt", "checkGrammar", "checkTone", "checkClarity", "checkSensitivity", "preferredTone", formality) FROM stdin;
cm5zkqcnp00073efiuy1bog04	cm5wcp81900043euykpvmf9pf	after	f	2025-01-16 16:57:39.733	2025-01-17 12:44:26.204	t	t	t	t	professional	9
cm5zgxmzx00013ejczopw3kmj	cm5wcp81a00063euywix6zte8	after	f	2025-01-16 15:11:21.262	2025-01-16 21:35:38.427	t	t	t	t	professional	5
\.


--
-- Data for Name: Avatar; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Avatar" (id, "userId", name, description, personality, "isActive", "contextLimit", temperature, "createdAt", "updatedAt", settings) FROM stdin;
cm613v0hv00013e671u7x7cq2	cm5wcp81900043euykpvmf9pf	Marc's Avatar	A professional avatar. IRL may vary.	professional	t	10	0.7	2025-01-17 18:40:56.131	2025-01-17 18:40:56.131	\N
\.


--
-- Data for Name: AvatarAnalytics; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AvatarAnalytics" (id, "avatarId", "userId", "timestamp", "eventType", metadata) FROM stdin;
\.


--
-- Data for Name: AvatarConversation; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AvatarConversation" (id, "avatarId", "userId", "messageId", response, context, "createdAt", embedding, "relevanceScore", "isMemoryContext") FROM stdin;
\.


--
-- Data for Name: AvatarDocument; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AvatarDocument" (id, "avatarId", name, content, "fileUrl", "mimeType", "vectorId", "createdAt", "updatedAt", embedding) FROM stdin;
cm61fhrk3000e3evox1vhont7	cm613v0hv00013e671u7x7cq2	mb_current.pdf		https://utfs.io/f/39551d45-0ba2-4094-80bc-cb9761de0bdc-tmsugh.pdf	application/pdf	pending	2025-01-18 00:06:33.411	2025-01-18 00:06:33.411	\N
cm61fi421000f3evofb3eeiig	cm613v0hv00013e671u7x7cq2	Project 1 BrainLift.txt		https://utfs.io/f/24867a49-9bab-40f8-ab08-5cff990b76a8-ljmfjf.txt	text/plain	pending	2025-01-18 00:06:49.597	2025-01-18 00:06:49.597	\N
\.


--
-- Data for Name: AvatarMetrics; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AvatarMetrics" (id, "avatarId", "userId", "messageLength", "responseLength", "timestamp") FROM stdin;
cm61grmot00033e87wdp17ucr	cm613v0hv00013e671u7x7cq2	user_2rMHyBnIQ99kR4wVh2v9YWxOcbU	21	185	2025-01-18 00:37:17.116
\.


--
-- Data for Name: AvatarPerformance; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."AvatarPerformance" (id, "avatarId", "latencyMs", "tokensUsed", "cacheHit", status, "errorType", "timestamp") FROM stdin;
cm61g9lnw00013evzgwskjvow	cm613v0hv00013e671u7x7cq2	1737160092137	0	f	success	\N	2025-01-18 00:28:12.137
cm61gdrh400013ecqk2ggjjv0	cm613v0hv00013e671u7x7cq2	1737160286291	0	f	success	\N	2025-01-18 00:31:26.291
cm61gj1js00013esfvdz4gey6	cm613v0hv00013e671u7x7cq2	385	0	f	error	ReferenceError	2025-01-18 00:35:32.628
cm61gla6900013e8761difz9i	cm613v0hv00013e671u7x7cq2	3203	0	f	success	\N	2025-01-18 00:37:17.116
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
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."File" (id, "messageId", url, "fileType", "createdAt") FROM stdin;
cm5x02vgw00023e7lslfj6p4y	cm5x02vgw00013e7lttaj1re3	https://utfs.io/f/776e27ea-02c6-4c9d-88d9-9135878d0711-4n443s.png	png	2025-01-14 21:43:59.696
cm5x06mcl00073e7lxrzzmw0t	cm5x06mcl00063e7lkmzihju5	https://utfs.io/f/d0b4b4af-134f-4130-96ae-091816e6975e-7vrju8.png	png	2025-01-14 21:46:54.501
cm5x4nhqy00023ewra3h317pa	cm5x4nhqy00013ewrdasrkmld	https://utfs.io/f/845948f8-43b4-4e56-9365-a294e043ef85-q1fsof.png	png	2025-01-14 23:52:00.154
cm5x8p6ix00023e7u4ginbow7	cm5x8p6ix00013e7utqbwhhm6	https://utfs.io/f/0435b656-c82d-44d8-a2ff-03bb4bbe2464-m26sw9.png	png	2025-01-15 01:45:17.385
cm5xa1p5o00023eixflo70kat	cm5xa1p5o00013eix6rogvx9m	https://utfs.io/f/034dfc7d-a022-4fbb-b857-7be0fae8fcff-kqfbhg.png	png	2025-01-15 02:23:01.021
cm5y1jyt800023e11fvbhv6nl	cm5y1jyt800013e11vkiyzzke	https://utfs.io/f/acdd610c-84de-4439-9e04-a93d5a63e3ab-4n443s.png	png	2025-01-15 15:13:02.972
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Message" (id, content, "createdAt", "updatedAt", "userId", "channelId", "recipientId", "parentId", "replyCount", "isAIResponse", embedding) FROM stdin;
cm5webycs00013e1i7rjauakz	Hey, how are you?	2025-01-14 11:35:11.788	2025-01-14 11:35:11.788	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5wgbzzl00063emsjb5xo3cp	Can you help me with the project?	2025-01-14 12:31:13.136	2025-01-14 12:31:13.136	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f	\N
cm5wgd9pj000a3emso2obyvdc	I'm good, thanks! How about you?	2025-01-14 12:32:12.389	2025-01-14 12:32:12.389	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5wgdrib000g3ems2md66768	Sure setup a meeting to discuss	2025-01-14 12:32:35.459	2025-01-14 12:32:35.459	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5wgeohz000k3emsaqo1dwnt	Do you to in the project meeting with marcai?	2025-01-14 12:33:18.214	2025-01-14 12:33:18.214	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	f	\N
cm5wkt15g00013e5myktj2e6a	A new chat, without all all the nonsense!	2025-01-14 14:36:26.259	2025-01-14 14:36:26.259	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5wkvaka00053e5m2ukcr7oz	Dis you setup a meeting?	2025-01-14 14:38:11.769	2025-01-14 14:38:11.769	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5wkyo9r00013edin5wpo4as	What if someone posts nonsense?	2025-01-14 14:40:49.503	2025-01-14 14:40:49.503	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5wli7m000013e16pvnmz5hm	Did you setup the meeting, I did not get an invite?	2025-01-14 14:56:01.032	2025-01-14 14:56:01.032	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5wmgfcn00013elpz3majupx	hey, I'm busy	2025-01-14 15:22:37.367	2025-01-14 15:22:37.367	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5wmlqd500053elpfxordl7j	still very busy	2025-01-14 15:26:44.921	2025-01-14 15:26:44.921	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5wy1ca400013eoyc21mt3nl	Bill schedule the meeting for tomorrow in Backbay	2025-01-14 20:46:48.94	2025-01-14 20:46:48.94	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5wz0c2x00013ecniuxk25cl	Tired, it has been long day	2025-01-14 21:14:01.64	2025-01-14 21:14:01.64	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5x02vgw00013e7lttaj1re3	whoa!	2025-01-14 21:43:59.696	2025-01-14 21:43:59.696	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5x06mcl00063e7lkmzihju5	a great dog	2025-01-14 21:46:54.501	2025-01-14 21:46:54.501	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5x0fpws00013egyil9lm9lo	A noble beast	2025-01-14 21:53:59.019	2025-01-14 21:53:59.019	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f	\N
cm5x0xo4g00053egywxcb3hea	bad fall	2025-01-14 22:07:56.504	2025-01-14 22:07:56.504	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5x4nhqy00013ewrdasrkmld	worse	2025-01-14 23:52:00.154	2025-01-14 23:52:00.154	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5x8p6ix00013e7utqbwhhm6		2025-01-15 01:45:17.385	2025-01-15 01:45:17.385	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5x9ipfx00013e4q48cl35vo	The picture in the message does not make sense	2025-01-15 02:08:14.924	2025-01-15 02:08:14.924	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5x9nala00073e4q4au3yi5a	stop the nonsense messages	2025-01-15 02:11:48.959	2025-01-15 02:11:48.959	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5x9oxqt00093e4qyso9f90b	stop the nonsense messages	2025-01-15 02:13:05.619	2025-01-15 02:13:05.619	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0	f	\N
cm5x9s0cy00013e8kzk6khj0i	Bill schedule the meeting for tomorrow in Backbay	2025-01-15 02:15:28.977	2025-01-15 02:15:28.977	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f	\N
cm5x9xex600053e8ku303womt	Bill schedule the meeting for tomorrow in Backbay	2025-01-15 02:19:41.13	2025-01-15 02:19:41.13	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0	f	\N
cm5x9y09700093e8kb5t48vvr	hey everyone!	2025-01-15 02:20:08.779	2025-01-15 02:20:08.779	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5xa1p5o00013eix6rogvx9m	check this out	2025-01-15 02:23:01.021	2025-01-15 02:23:01.021	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5xas2pi00013eps1a0oohjl	what?	2025-01-15 02:43:31.638	2025-01-15 02:43:31.638	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xb32jt00053epsi7nisqz3	what?	2025-01-15 02:52:04.647	2025-01-15 02:52:04.647	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xb3pir00093epsom8cq7yj	I said what?	2025-01-15 02:52:34.419	2025-01-15 02:52:34.419	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xb5rx2000d3epsrj7ry9vr	what?	2025-01-15 02:54:10.838	2025-01-15 02:54:10.838	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xb831l000h3epsw3p90add	are you there?	2025-01-15 02:55:58.569	2025-01-15 02:55:58.569	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xbbxdq000l3epsm3cksh0e	I am going home	2025-01-15 02:58:57.854	2025-01-15 02:58:57.854	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xbe7ys000p3eps26b9dc0k	where is the meeting?	2025-01-15 03:00:44.885	2025-01-15 03:00:44.885	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5xbef38000t3epszcgs7fpe	[AI Response] Hello [Recipient’s Name],\n\nThank you for reaching out. I am currently away and unable to attend the meeting. Please proceed as planned, and feel free to update me on any important developments afterward.\n\nBest regards,  \nBill W.	2025-01-15 03:00:54.116	2025-01-15 03:00:54.116	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5xbj4rg000v3epsprgkxci5	nothing makes sense	2025-01-15 03:04:34.012	2025-01-15 03:04:34.012	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5xblsrf00113epskm4m9sjr	more so today	2025-01-15 03:06:38.425	2025-01-15 03:06:38.425	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5y1jyt800013e11vkiyzzke	Commute this morning	2025-01-15 15:13:02.972	2025-01-15 15:13:02.972	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5zcoimp000b3eldn9g21fsi	Hey bill, you onsite?	2025-01-16 13:12:17.231	2025-01-16 13:12:17.231	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zim3z100033e41b5wvt9ab	test	2025-01-16 15:58:22.621	2025-01-16 15:58:22.621	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm5zkpjk900013efi8dxut9cx	I need the command(s) to reinstall dependencies in npm	2025-01-16 16:57:02.024	2025-01-16 16:57:02.024	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zkprzy00053efiz7a1tg2k	[AI] I am currently Away. To reinstall dependencies in npm, you can use the following command:\n\n```bash\nnpm install\n```\n\nBest regards,  \nbillw	2025-01-16 16:57:12.958	2025-01-16 16:57:12.958	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zlcrct00013e44k1hetc6t	What does this do?DROP SCHEMA public CASCADE;	2025-01-16 17:15:05.214	2025-01-16 17:15:05.214	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zrxjlc00013e3mke3xhsyc	terminated unexpectedly with code 18446744072796410000	2025-01-16 20:19:12.624	2025-01-16 20:19:12.624	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zs7ira00013e49122a0b99	the message is being proofread when sent	2025-01-16 20:26:58.102	2025-01-16 20:26:58.102	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zs7s7g00053e49u9w4jtmp	[AI] Thank you for your message. Please note that I am currently away. The message is being proofread when sent.\n\nBest regards,  \nbillw	2025-01-16 20:27:10.348	2025-01-16 20:27:10.348	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zsukoo00013ex6suq30ndr	Hey no proofing	2025-01-16 20:44:53.688	2025-01-16 20:44:53.688	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zsur4300053ex6p94rp48l	[AI] Hi,\n\nI am currently away and unable to assist with proofing. I will get back to you when I return.\n\nBest regards,  \nbillw	2025-01-16 20:45:02.019	2025-01-16 20:45:02.019	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zw2mz2000v3eutwmz3kxy0	no way ou	2025-01-16 22:15:08.736	2025-01-16 22:15:08.736	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zw2reh000z3euto8mfgo69	[AI] I'm currently away. Thank you for your understanding.  \nBest,  \nbillw	2025-01-16 22:15:14.489	2025-01-16 22:15:14.489	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zw6zqb00113eutnnmrsscb	No way out.	2025-01-16 22:18:31.907	2025-01-16 22:18:31.907	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm5zw749y00153euti7q1n9au	[AI] I understand your concern, but please note that I am currently away. If you need assistance, I will get back to you as soon as I return. \n\nBest,  \nbillw	2025-01-16 22:18:37.798	2025-01-16 22:18:37.798	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zzphdx00013euo32lsvjlh	Let's test this out.	2025-01-16 23:56:53.443	2025-01-16 23:56:53.443	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm5zzpkgq00053euo5b9jplbd	[AI] Thank you for your message. I am currently Away, but I will respond as soon as I can. \n\nBest,  \nbillw	2025-01-16 23:56:57.434	2025-01-16 23:56:57.434	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm5zzt6di00073euoogyg7iac	[AI edited] Messages modified by the AI are displayed in a different color than the original message.	2025-01-16 23:59:45.799	2025-01-16 23:59:45.799	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm600clvl000j3euo21neuwbw	[AI edited] That was really unpleasant. Perhaps next time you could consider your words more carefully.	2025-01-17 00:14:52.353	2025-01-17 00:14:52.353	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm604eu9w00033eco2kpyl2o7	[AI edited] I'm really frustrated right now; I think I'm done.	2025-01-17 02:08:35.012	2025-01-17 02:08:35.012	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm604f00l00073ecofweslq5n	[AI] I understand that you're feeling frustrated right now. Please know that I am currently Away but will address your concerns as soon as I can. Thank you for your patience.  \n\nBest,  \nbillw	2025-01-17 02:08:42.453	2025-01-17 02:08:42.453	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm604ub8x00093eco1j7yxn4t	what did I say originally, this does not sound like me?	2025-01-17 02:20:36.849	2025-01-17 02:20:36.849	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	cm5zzwp8n000d3euovyspzwgf	0	f	\N
cm604vcdd000b3ecoq8nkuzim	[AI edited] you fucking idiot	2025-01-17 02:21:24.961	2025-01-17 02:21:24.961	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm604vf4p000f3ecosrp8299r	[AI] I am currently Away. Please feel free to reach out again later.  \nBest,  \nbillw	2025-01-17 02:21:28.537	2025-01-17 02:21:28.537	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm606fn8000013e327os42fpy	[AI edited] Hello?	2025-01-17 03:05:11.761	2025-01-17 03:05:11.761	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm606fqui00053e329b0zss2y	[AI] Hello, I am currently Away. \n\nBest,  \nbillw	2025-01-17 03:05:16.458	2025-01-17 03:05:16.458	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm606i0bd00073e327t3mltcl	what does this  - GRANT ALL ON SCHEMA public TO slackgauntlet;?	2025-01-17 03:07:02.041	2025-01-17 03:07:02.041	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	cm600e3om000n3euo3c56kd35	0	f	\N
cm600e3om000n3euo3c56kd35	That was really thoughtless.	2025-01-17 00:16:02.086	2025-01-17 03:07:02.041	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	1	f	\N
cm606ybxt000b3e32wd7nxyvv	What does this command - GRANT ALL ON SCHEMA public TO slackgauntlet; mean?	2025-01-17 03:19:43.599	2025-01-17 03:19:43.599	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm606yxdq000f3e32a2eekdjc	What does this command - GRANT ALL ON SCHEMA public TO slackgauntlet;?	2025-01-17 03:20:11.39	2025-01-17 03:20:11.39	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm606zhff000h3e32jmf3nkou	What  this command - GRANT ALL ON SCHEMA public TO slackgauntlet; mean?	2025-01-17 03:20:37.372	2025-01-17 03:20:37.372	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm6073hp3000j3e32g9kg4g04	What does this command - GRANT ALL ON SCHEMA public TO slackgauntlet; mean?	2025-01-17 03:23:44.344	2025-01-17 03:23:44.344	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm6085rg100013e3hjaikcp1z	hello company	2025-01-17 03:53:29.906	2025-01-17 03:53:29.906	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm6086ep200033e3hzv91nqga	ello company	2025-01-17 03:54:00.039	2025-01-17 03:54:00.039	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm608anzg00093e3hxk2i65iv	[AI] I understand your frustration. I am currently Away but will address your concerns as soon as I return. Thank you for your patience. \n\nBest,  \nbillw	2025-01-17 03:57:18.701	2025-01-17 03:57:18.701	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm608i4q0000b3e3hwz5hz7bm	what the fuck is up with that?	2025-01-17 04:03:06.984	2025-01-17 04:03:06.984	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm608i85a000f3e3hw7onp0wf	[AI] I understand your frustration. I am currently Away but will address this as soon as I return. Thank you for your patience.  \n\nBest,  \nbillw	2025-01-17 04:03:11.422	2025-01-17 04:03:11.422	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm608loz7000h3e3ha9x170ms	what the fuck is up with that?	2025-01-17 04:05:53.203	2025-01-17 04:05:53.203	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm608ltt3000l3e3hgmltohqw	[AI] Thank you for reaching out. I am currently Away, but I'll get back to you as soon as I can. \n\nBest,  \nbillw	2025-01-17 04:05:59.463	2025-01-17 04:05:59.463	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm6099l1m000n3e3hgwn813lv	what the  is up with that?	2025-01-17 04:24:27.849	2025-01-17 04:24:27.849	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm6099qlg000r3e3hhq73lbyz	[AI] I am currently Away. If you have any specific concerns or questions, please let me know when I return. \n\nBest,  \nbillw	2025-01-17 04:24:35.044	2025-01-17 04:24:35.044	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm609p4wy000t3e3hjo01umet	what the is up with that?	2025-01-17 04:36:33.442	2025-01-17 04:36:33.442	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm609padq000x3e3h04w3llcv	[AI] I understand your concern. I am currently Away, but I'll be sure to address any issues as soon as I'm back. Thank you for your patience.  \n\nBest,  \nbillw	2025-01-17 04:36:40.526	2025-01-17 04:36:40.526	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm609s09b000z3e3hwnu45j5s	what the is up with that?	2025-01-17 04:38:47.376	2025-01-17 04:38:47.376	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm609s38j00133e3h64lt0dyy	[AI] I understand your concern. I am currently Away and will get back to you as soon as possible. Thank you for your patience. \n\nBest,  \nbillw	2025-01-17 04:38:51.235	2025-01-17 04:38:51.235	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm609y18u00013eij9wdcnq44	what the is up with that?	2025-01-17 04:43:28.59	2025-01-17 04:43:28.59	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm609y6dy00053eijc3abv8o0	[AI] I understand your concerns, but I am currently Away. Please let me know if there's anything specific I can address upon my return. \n\nBest,  \nbillw	2025-01-17 04:43:35.253	2025-01-17 04:43:35.253	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60a5hkc00073eijcrii0ufs	what the is up with that?	2025-01-17 04:49:16.333	2025-01-17 04:49:16.333	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60a5krl000b3eij9d0q722x	[AI] I am currently Away. If you have any questions or need assistance, please let me know, and I will get back to you as soon as possible. \n\nBest,  \nbillw	2025-01-17 04:49:20.481	2025-01-17 04:49:20.481	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60aar6e000d3eijavrjo1au	hat the is up with that?	2025-01-17 04:53:22.07	2025-01-17 04:53:22.07	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60aauol000h3eij7yxa6zqw	[AI] I am currently Away. If you have any concerns, please feel free to reach out later. \n\nBest,  \nbillw	2025-01-17 04:53:26.613	2025-01-17 04:53:26.613	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60b22m1000j3eijfgphwzt4	[AI edited] What is up with that?	2025-01-17 05:14:36.601	2025-01-17 05:14:36.601	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60b25x6000n3eijhqmku4jq	[AI] I am currently Away and unable to provide further details at this time. Thank you for your understanding. \n\nBest,  \nbillw	2025-01-17 05:14:40.89	2025-01-17 05:14:40.89	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60b2l41000p3eijhvoqew7s	hat the is up with that?	2025-01-17 05:15:00.577	2025-01-17 05:15:00.577	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm60btmuu00013es21482qxrt	[AI edited] what the is up with that?	2025-01-17 05:36:02.55	2025-01-17 05:36:02.55	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60bu3xd00033es246s77ord	[AI edited] What is up with that?	2025-01-17 05:36:24.673	2025-01-17 05:36:24.673	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60bu6h000073es26egfpfsv	[AI] I am currently Away. I'll get back to you as soon as I can.  \n\nBest,  \nbillw	2025-01-17 05:36:27.972	2025-01-17 05:36:27.972	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60bunry000b3es2q7utf52w	hat the is up with that?	2025-01-17 05:36:50.399	2025-01-17 05:36:50.399	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60buqdb000f3es2gur4b7v8	[AI] Hello, \n\nI am currently Away. If you have any questions, please feel free to reach out later. \n\nBest,  \nbillw	2025-01-17 05:36:53.759	2025-01-17 05:36:53.759	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60di1gb000j3es2p0xcan90	[AI edited] The AI is presented in a different manner.	2025-01-17 06:23:00.827	2025-01-17 06:23:00.827	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60dous7000n3es2mgf0p3lv	[AI edited] Proof read my messages.	2025-01-17 06:28:18.775	2025-01-17 06:28:18.775	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60dpmzt000p3es2iwpjdguy	[AI edited] Proofread my messages, please.	2025-01-17 06:28:55.338	2025-01-17 06:28:55.338	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60dppun000t3es2i3pbm61r	[AI] I am currently Away. I’ll be happy to help you proofread your messages when I return. \n\nBest regards,  \nbillw	2025-01-17 06:28:59.04	2025-01-17 06:28:59.04	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60dq3bk000x3es2cxfys9yd	Proofread my messages, please.	2025-01-17 06:29:16.496	2025-01-17 06:29:16.496	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60dq75200113es2g36e59jb	[AI] I am currently Away and unable to proofread your messages. Thank you for your understanding.  \n\nBest,  \nbillw	2025-01-17 06:29:21.446	2025-01-17 06:29:21.446	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60dqf6v00133es2hgsnkim6	Proofread my messages.	2025-01-17 06:29:31.878	2025-01-17 06:29:31.878	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm60ohzru00013ex0jq3j3iyo	Once completed, design the implementation considering our existing architecture.	2025-01-17 11:30:54.426	2025-01-17 11:30:54.426	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm60oine800033ex0w4840fv4	onses. design the impletation considering our existing arch	2025-01-17 11:31:25.04	2025-01-17 11:31:25.04	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm60ojuw400053ex05ulnjau3	onses. design the implemon considering our existing arch	2025-01-17 11:32:21.412	2025-01-17 11:32:21.412	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	f	\N
cm60oksb000093ex0htnibbov	[AI edited] ones. design implementation considering our existing arch	2025-01-17 11:33:04.716	2025-01-17 11:33:04.716	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60omf3e000b3ex0tbl4t96n	[AI edited] Would you like me to elaborate on any specific aspect of this implementation?	2025-01-17 11:34:20.907	2025-01-17 11:34:20.907	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60omi5c000f3ex0865onafs	[AI] Thank you for your offer. I am currently away and unable to discuss specific aspects at the moment. \n\nBest,  \nbillw	2025-01-17 11:34:24.865	2025-01-17 11:34:24.865	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60osea5000j3ex0hr7ail1m	Would you like me to detail any specific parts of this implementation?	2025-01-17 11:38:59.79	2025-01-17 11:38:59.79	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60oshmv000n3ex0nbqjcjs0	[AI] Thank you for offering, but I am currently away and unable to review specific details at this time. I appreciate your understanding. \n\nBest,  \nbillw	2025-01-17 11:39:04.135	2025-01-17 11:39:04.135	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60r0x2p00013eqczx1hv2vo	complete code for each component	2025-01-17 12:41:36.625	2025-01-17 12:41:36.625	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	f	\N
cm60r10b500053eqcd0f53x4x	[AI] I am currently Away. Please specify which components you need code for, and I will assist you when I return. \n\nBest,  \nbillw	2025-01-17 12:41:40.817	2025-01-17 12:41:40.817	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60r4ply00093eqcgkz68d5s	[AI edited] Complete code for each component.	2025-01-17 12:44:33.575	2025-01-17 12:44:33.575	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60r4t41000d3eqcuie2plzl	[AI] I am currently Away. Please provide more details about the components you need, and I will address them upon my return.\n\nBest,  \nbillw	2025-01-17 12:44:38.113	2025-01-17 12:44:38.113	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60r7dwc000f3eqcaft9lhmz	[AI edited] plete code for each component	2025-01-17 12:46:38.365	2025-01-17 12:46:38.365	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60t7w4m00013e4zc313xby3	[AI edited] Continuing with the avatar feature: Implementing conversation functionality while considering our existing architecture and ensuring compatibility with our stack.	2025-01-17 13:43:01.219	2025-01-17 13:43:01.219	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60t7zod00053e4ztq63qr7z	[AI] Subject: Re: Avatar Feature Implementation\n\nThank you for the update. I completely agree on focusing on conversation functionality while ensuring compatibility with our existing architecture. I am currently away but will review the details upon my return.\n\nBest,  \nbillw	2025-01-17 13:43:05.821	2025-01-17 13:43:05.821	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60t8rnc00073e4z6vegxyik	[AI edited] continuing with the avatar feature. implement 5. implementing conversation memory. design the architecture and compatibility with our stack.	2025-01-17 13:43:42.072	2025-01-17 13:43:42.072	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60tvasu00013e3n2y8lwi6f	[AI edited] User can accept or reject before moving forward.	2025-01-17 14:01:13.326	2025-01-17 14:01:13.326	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60twwej00033e3nxir4xn7n	[AI edited] The user can accept or reject any changes made by AI before sending.	2025-01-17 14:02:27.978	2025-01-17 14:02:27.978	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60twzjq00073e3n9bhr9qrc	[AI] Thank you for your message. I am currently away and unable to assist at this moment. \n\nBest,  \nbillw	2025-01-17 14:02:32.054	2025-01-17 14:02:32.054	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm60uoqkd00013exd8etszz2b	nothing important	2025-01-17 14:24:06.781	2025-01-17 14:24:06.781	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	cm5zzwp8n000d3euovyspzwgf	0	f	\N
cm60vcytm00013ett4upr5eeq	[AI edited] implement the ui for user management of their ai avatar feature	2025-01-17 14:42:57.226	2025-01-17 14:42:57.226	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm60vea2a00033ettx3g3b6xl	[AI edited] Continuing with the avatar feature, please implement the UI for users to manage their avatars.	2025-01-17 14:43:58.45	2025-01-17 14:43:58.45	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm60vede300073ettw27vqnvu	[AI] Thank you for your request regarding the avatar feature. I will ensure that the UI for managing avatars is implemented. However, please note that I am currently Away. I will address this as soon as I'm back.\n\nBest,  \nbillw	2025-01-17 14:44:02.763	2025-01-17 14:44:02.763	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm611fzrz00013ex4el6xdels	you sure	2025-01-17 17:33:16.127	2025-01-17 17:33:16.127	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	cm5zzwp8n000d3euovyspzwgf	0	f	\N
cm5zzwp8n000d3euovyspzwgf	[AI edited] That was an incredibly bad fall.	2025-01-17 00:02:30.215	2025-01-17 17:33:16.127	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	3	t	\N
cm611gn0a00033ex445r9glno	[AI edited] database is now synced	2025-01-17 17:33:46.234	2025-01-17 17:33:46.234	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm611h8ks00053ex4010gr9eo	[AI edited] The database is now synchronized.	2025-01-17 17:34:14.188	2025-01-17 17:34:14.188	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm611hbf400093ex4djqje6og	[AI] Thank you for the update. I am currently Away.  \n\nBest,  \nbillw	2025-01-17 17:34:17.872	2025-01-17 17:34:17.872	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm6189mai00013e4o8pxpbvii	[AI edited] Continuing with the avatar feature, let’s add the UI for interacting with a user AI and include a User Avatar.	2025-01-17 20:44:16.026	2025-01-17 20:44:16.026	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm618a8cc00033e4otqhb3gee	[AI edited] Continuing with the avatar feature, implement the UI for interacting with a user AI. Add a User Avatar.	2025-01-17 20:44:44.604	2025-01-17 20:44:44.604	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm618aaxx00073e4oe3jpby9o	[AI] Hello,\n\nThank you for your request regarding the avatar feature. I will ensure that the UI for interacting with a user AI, including the User Avatar, is implemented. \n\nPlease note, I am currently Away.\n\nBest regards,  \nbillw	2025-01-17 20:44:47.973	2025-01-17 20:44:47.973	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm61babbx00043egrys6476s6	[AI edited] give a full fix, with all the files needed.	2025-01-17 22:08:47.325	2025-01-17 22:08:47.325	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm61bb05p00063egr88e94iaf	[AI edited] Provide complete fix including: - All necessary files.	2025-01-17 22:09:19.501	2025-01-17 22:09:19.501	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61bfy8h000a3egrsexp3ckj	Hello,\n\nThank you for reaching out. I'm responding on behalf of the user who is currently unavailable. Regarding the issue you're facing with the foreign key constraint failing on the field: AIProofingSet, it seems like a database related issue. \n\nUnfortunately, I don't have the exact details of the user's actions leading to this error. Once they are available, they will reach out to you to provide more context or possible solutions. \n\nWe appreciate your understanding and patience in this matter.\n\nBest Regards.	2025-01-17 22:13:10.287	2025-01-17 22:13:10.287	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm61bvshx00013eg31ozq75bw	[AI edited] In the pinecone vector database.	2025-01-17 22:25:29.349	2025-01-17 22:25:29.349	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61bvux600053eg3vsu3h88g	[AI] Thank you for your message. I am currently Away. \n\nBest regards,  \nbillw	2025-01-17 22:25:32.49	2025-01-17 22:25:32.49	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm61bwtah00073eg3jrm0nmjk	[AI edited] Implementing the Pinecone vector db.	2025-01-17 22:26:17.031	2025-01-17 22:26:17.031	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm61c67iw00033e24ifdo30z7	{AI} I am currently away. I'll respond when I return.	2025-01-17 22:33:35.381	2025-01-17 22:33:35.385	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61cbzua00053e2484kon306	{AI} I am currently away. I'll respond when I return.	2025-01-17 22:38:05.358	2025-01-17 22:38:05.362	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61denuc00073e24dmvzcvvs	[AI edited] It appears to be a database-related issue.	2025-01-17 23:08:09.394	2025-01-17 23:08:09.394	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61deqej000b3e24473r0qay	[AI] Thank you for the update. I am currently Away, but I will look into the database issue upon my return.   \n\nBest,  \nbillw	2025-01-17 23:08:12.715	2025-01-17 23:08:12.715	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm61dfgy9000d3e240hafy5xq	[AI edited] Set, it seems like a database-related issue. Un	2025-01-17 23:08:47.122	2025-01-17 23:08:47.122	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm61dftij000f3e2427fd1gwk	[AI edited] Set, it looks like a database-related issue. Un	2025-01-17 23:09:03.403	2025-01-17 23:09:03.403	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm61dg6z8000h3e24qjmhsjhx	[AI edited] Set, it seems like a database-related issue.	2025-01-17 23:09:20.852	2025-01-17 23:09:20.852	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	\N	\N	0	t	\N
cm61dh1zw000j3e24ic3jnmrp	I don't have personal experiences or employment history, so I haven't worked at ESS Laboratory or any other organization. However, I can provide information or answer questions related to laboratory practices, research, or any other relevant topics. How may I assist you today?	2025-01-17 23:10:01.05	2025-01-17 23:10:01.053	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61djsgg000l3e24uzlg2w6n	As Marc's Avatar, I don't have personal work experience, but I can provide information about LabAnswer if that would help. LabAnswer is known for its consulting services in laboratory operations and management. If you have specific questions about their services or anything related, feel free to ask!	2025-01-17 23:12:08.646	2025-01-17 23:12:08.656	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61echyn00063e34r6vetpg4	[AI edited] Hey there!	2025-01-17 23:34:28.078	2025-01-17 23:34:28.078	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61edeth000a3e34z5pmwo8k	As Marc's Avatar, I don’t have personal experiences or a work history. However, if you have questions about DCSS or related topics, I’d be happy to provide information or assist you in any way I can.	2025-01-17 23:35:10.657	2025-01-17 23:35:10.661	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61essi400013e6qvludmiz5	As Marc's Avatar, I can clarify that I do not have a personal work history. However, if you have questions about DCSS or need information related to that organization, I'd be more than happy to assist you!	2025-01-17 23:47:08.235	2025-01-17 23:47:08.237	cm5wcp81900043euykpvmf9pf	\N	\N	\N	0	t	\N
cm61f6frd00013evoyoel7van	[AI edited] Hey!	2025-01-17 23:57:44.904	2025-01-17 23:57:44.904	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61f6ige00053evof65ihfnq	[AI] Hello! I am currently away. Thank you for your message.  \n\nBest,  \nbillw	2025-01-17 23:57:48.398	2025-01-17 23:57:48.398	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
cm61f7bzv00073evo3nlniyrb	[AI edited] User-friendly configuration 5: Secure document handling.	2025-01-17 23:58:26.683	2025-01-17 23:58:26.683	cm5wcp81900043euykpvmf9pf	\N	cm5wcp81a00063euywix6zte8	\N	0	t	\N
cm61f7eu6000b3evoph0mo8lm	[AI] Thank you for your message regarding user-friendly configuration for secure document handling. I appreciate your insights. I am currently away and will respond in more detail upon my return. \n\nBest,  \nbillw	2025-01-17 23:58:30.366	2025-01-17 23:58:30.366	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0	t	\N
\.


--
-- Data for Name: MessageRead; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."MessageRead" (id, "messageId", "userId", "channelId", "createdAt", "updatedAt") FROM stdin;
cm608i4q5000d3e3hahqk7nx4	cm608i4q0000b3e3hwz5hz7bm	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:03:06.989	2025-01-17 04:03:06.989
cm608loze000j3e3heu4ap1sp	cm608loz7000h3e3ha9x170ms	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:05:53.211	2025-01-17 04:05:53.211
cm6099l1z000p3e3hq0zgyo7o	cm6099l1m000n3e3hgwn813lv	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:24:27.863	2025-01-17 04:24:27.863
cm609p4x7000v3e3hitus2ea6	cm609p4wy000t3e3hjo01umet	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:36:33.452	2025-01-17 04:36:33.452
cm609s09i00113e3hfh8s4jnt	cm609s09b000z3e3hwnu45j5s	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:38:47.382	2025-01-17 04:38:47.382
cm609y19100033eijia8boxnv	cm609y18u00013eij9wdcnq44	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:43:28.598	2025-01-17 04:43:28.598
cm60a5hkj00093eijig4393rf	cm60a5hkc00073eijcrii0ufs	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:49:16.339	2025-01-17 04:49:16.339
cm60aara5000f3eijp83qlydx	cm60aar6e000d3eijavrjo1au	cm5wcp81a00063euywix6zte8	\N	2025-01-17 04:53:22.205	2025-01-17 04:53:22.205
cm60b22mf000l3eijopa3abir	cm60b22m1000j3eijfgphwzt4	cm5wcp81a00063euywix6zte8	\N	2025-01-17 05:14:36.615	2025-01-17 05:14:36.615
cm60bu3xl00053es25jje0q8s	cm60bu3xd00033es246s77ord	cm5wcp81a00063euywix6zte8	\N	2025-01-17 05:36:24.681	2025-01-17 05:36:24.681
cm60buns2000d3es2loi0you4	cm60bunry000b3es2q7utf52w	cm5wcp81a00063euywix6zte8	\N	2025-01-17 05:36:50.403	2025-01-17 05:36:50.403
cm60di1go000l3es298wjhg5i	cm60di1gb000j3es2p0xcan90	cm5wcp81a00063euywix6zte8	\N	2025-01-17 06:23:00.84	2025-01-17 06:23:00.84
cm60dpn05000r3es2ik75mhdz	cm60dpmzt000p3es2iwpjdguy	cm5wcp81a00063euywix6zte8	\N	2025-01-17 06:28:55.349	2025-01-17 06:28:55.349
cm60dq3br000z3es21xjv46u9	cm60dq3bk000x3es2cxfys9yd	cm5wcp81a00063euywix6zte8	\N	2025-01-17 06:29:16.504	2025-01-17 06:29:16.504
cm60omf3o000d3ex05ro2nums	cm60omf3e000b3ex0tbl4t96n	cm5wcp81a00063euywix6zte8	\N	2025-01-17 11:34:20.916	2025-01-17 11:34:20.916
cm60oseab000l3ex0mtfcbm0b	cm60osea5000j3ex0hr7ail1m	cm5wcp81a00063euywix6zte8	\N	2025-01-17 11:38:59.795	2025-01-17 11:38:59.795
cm60r0x2y00033eqcb87xf8ff	cm60r0x2p00013eqczx1hv2vo	cm5wcp81a00063euywix6zte8	\N	2025-01-17 12:41:36.634	2025-01-17 12:41:36.634
cm60r4pm7000b3eqcyp1opc7i	cm60r4ply00093eqcgkz68d5s	cm5wcp81a00063euywix6zte8	\N	2025-01-17 12:44:33.583	2025-01-17 12:44:33.583
cm60t7w4x00033e4zya8bxcwp	cm60t7w4m00013e4zc313xby3	cm5wcp81a00063euywix6zte8	\N	2025-01-17 13:43:01.234	2025-01-17 13:43:01.234
cm60twwex00053e3n3bvzw3tq	cm60twwej00033e3nxir4xn7n	cm5wcp81a00063euywix6zte8	\N	2025-01-17 14:02:27.994	2025-01-17 14:02:27.994
cm60vea2j00053ettdkx8aotz	cm60vea2a00033ettx3g3b6xl	cm5wcp81a00063euywix6zte8	\N	2025-01-17 14:43:58.459	2025-01-17 14:43:58.459
cm611h8l300073ex4yh2kda3b	cm611h8ks00053ex4010gr9eo	cm5wcp81a00063euywix6zte8	\N	2025-01-17 17:34:14.199	2025-01-17 17:34:14.199
cm618a8co00053e4o3ix0haz9	cm618a8cc00033e4otqhb3gee	cm5wcp81a00063euywix6zte8	\N	2025-01-17 20:44:44.617	2025-01-17 20:44:44.617
cm61bb06200083egrh95y7fqc	cm61bb05p00063egr88e94iaf	cm5wcp81a00063euywix6zte8	\N	2025-01-17 22:09:19.514	2025-01-17 22:09:19.514
cm61bvsi800033eg3c19y7t26	cm61bvshx00013eg31ozq75bw	cm5wcp81a00063euywix6zte8	\N	2025-01-17 22:25:29.36	2025-01-17 22:25:29.36
cm61denux00093e24xycgv3m8	cm61denuc00073e24dmvzcvvs	cm5wcp81a00063euywix6zte8	\N	2025-01-17 23:08:09.417	2025-01-17 23:08:09.417
cm61echz500083e348j4z2flm	cm61echyn00063e34r6vetpg4	cm5wcp81a00063euywix6zte8	\N	2025-01-17 23:34:28.097	2025-01-17 23:34:28.097
cm61f6frl00033evolk1fkj8w	cm61f6frd00013evoyoel7van	cm5wcp81a00063euywix6zte8	\N	2025-01-17 23:57:44.913	2025-01-17 23:57:44.913
cm61f7c0g00093evoyiw7v9tn	cm61f7bzv00073evo3nlniyrb	cm5wcp81a00063euywix6zte8	\N	2025-01-17 23:58:26.704	2025-01-17 23:58:26.704
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."User" (id, username, "firstName", "lastName", email, "profilePicture", status, "statusMessage", "useAIResponse", "userRole", "createdAt", "updatedAt") FROM stdin;
cm5wcl72500023euyb67ri0aj	ducko	Duck	One	sneer-chip-running@duck.com	\N	\N	\N	f	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.304
cm5wcl72600033euyoz4hsvqn	duckt	Duck	Two	handling-nag-duvet@duck.com	\N	\N	\N	f	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.305
cm5wcp81a00053euyt3p32nhe	marcai	Marc	Gai	marc.breneiser@gauntletai.com	\N	available	\N	f	USER	2025-01-14 10:49:31.63	2025-01-14 20:39:26.845
cm5wcp81900043euykpvmf9pf	marcg	Marc	B	marc.breneiser@gmail.com	\N	available	\N	f	USER	2025-01-14 10:49:31.63	2025-01-14 20:57:18.98
cm5wcp81a00063euywix6zte8	billw	Bill	Williams	ridden-keep-robin@duck.com	\N	busy		t	USER	2025-01-14 10:49:31.63	2025-01-15 15:35:29.934
user_29w83sxmDNGwOuEthce5gg56FcC	useruser_29w	Example	Example	example@example.org	https://img.clerk.com/xxxxxx	\N	\N	f	USER	2025-01-17 19:54:54.34	2025-01-17 19:54:54.34
\.


--
-- Data for Name: UserAction; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."UserAction" (id, "userId", action, "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c525ac07-cfdf-4ae2-9d12-d48009eace54	1a54946d0369c3791a5c363cad992fc19f667414ec599d80acef22e382b906a0	2025-01-17 19:58:04.122992-05	20250118005803_add_vector_id_to_messages	\N	\N	2025-01-17 19:58:03.962558-05	1
b78717e2-3424-4d2e-a99c-cae36adb3e8b	d3c07acee3db87b1967bcece1ce9fbb48b34adde91dcc7479bd0ac26462d6d73	2025-01-17 20:11:41.654231-05	20250118011141_add_embeddings	\N	\N	2025-01-17 20:11:41.647919-05	1
\.


--
-- Name: AIProofingSettings AIProofingSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AIProofingSettings"
    ADD CONSTRAINT "AIProofingSettings_pkey" PRIMARY KEY (id);


--
-- Name: AvatarAnalytics AvatarAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarAnalytics"
    ADD CONSTRAINT "AvatarAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: AvatarConversation AvatarConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarConversation"
    ADD CONSTRAINT "AvatarConversation_pkey" PRIMARY KEY (id);


--
-- Name: AvatarDocument AvatarDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarDocument"
    ADD CONSTRAINT "AvatarDocument_pkey" PRIMARY KEY (id);


--
-- Name: AvatarMetrics AvatarMetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarMetrics"
    ADD CONSTRAINT "AvatarMetrics_pkey" PRIMARY KEY (id);


--
-- Name: AvatarPerformance AvatarPerformance_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarPerformance"
    ADD CONSTRAINT "AvatarPerformance_pkey" PRIMARY KEY (id);


--
-- Name: Avatar Avatar_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Avatar"
    ADD CONSTRAINT "Avatar_pkey" PRIMARY KEY (id);


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
-- Name: UserAction UserAction_pkey; Type: CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."UserAction"
    ADD CONSTRAINT "UserAction_pkey" PRIMARY KEY (id);


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
-- Name: AIProofingSettings_userId_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "AIProofingSettings_userId_key" ON public."AIProofingSettings" USING btree ("userId");


--
-- Name: AvatarAnalytics_avatarId_eventType_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarAnalytics_avatarId_eventType_idx" ON public."AvatarAnalytics" USING btree ("avatarId", "eventType");


--
-- Name: AvatarAnalytics_avatarId_timestamp_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarAnalytics_avatarId_timestamp_idx" ON public."AvatarAnalytics" USING btree ("avatarId", "timestamp");


--
-- Name: AvatarAnalytics_userId_timestamp_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarAnalytics_userId_timestamp_idx" ON public."AvatarAnalytics" USING btree ("userId", "timestamp");


--
-- Name: AvatarConversation_avatarId_isMemoryContext_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarConversation_avatarId_isMemoryContext_idx" ON public."AvatarConversation" USING btree ("avatarId", "isMemoryContext");


--
-- Name: AvatarConversation_avatarId_userId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarConversation_avatarId_userId_idx" ON public."AvatarConversation" USING btree ("avatarId", "userId");


--
-- Name: AvatarDocument_avatarId_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarDocument_avatarId_idx" ON public."AvatarDocument" USING btree ("avatarId");


--
-- Name: AvatarMetrics_avatarId_timestamp_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarMetrics_avatarId_timestamp_idx" ON public."AvatarMetrics" USING btree ("avatarId", "timestamp");


--
-- Name: AvatarPerformance_avatarId_timestamp_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "AvatarPerformance_avatarId_timestamp_idx" ON public."AvatarPerformance" USING btree ("avatarId", "timestamp");


--
-- Name: Avatar_userId_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "Avatar_userId_key" ON public."Avatar" USING btree ("userId");


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
-- Name: UserAction_userId_action_createdAt_idx; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE INDEX "UserAction_userId_action_createdAt_idx" ON public."UserAction" USING btree ("userId", action, "createdAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: slackgauntlet
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: AIProofingSettings AIProofingSettings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AIProofingSettings"
    ADD CONSTRAINT "AIProofingSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AvatarAnalytics AvatarAnalytics_avatarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarAnalytics"
    ADD CONSTRAINT "AvatarAnalytics_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES public."Avatar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AvatarConversation AvatarConversation_avatarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarConversation"
    ADD CONSTRAINT "AvatarConversation_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES public."Avatar"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AvatarDocument AvatarDocument_avatarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarDocument"
    ADD CONSTRAINT "AvatarDocument_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES public."Avatar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AvatarMetrics AvatarMetrics_avatarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarMetrics"
    ADD CONSTRAINT "AvatarMetrics_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES public."Avatar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AvatarPerformance AvatarPerformance_avatarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."AvatarPerformance"
    ADD CONSTRAINT "AvatarPerformance_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES public."Avatar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Avatar Avatar_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slackgauntlet
--

ALTER TABLE ONLY public."Avatar"
    ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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


--
-- PostgreSQL database dump complete
--

