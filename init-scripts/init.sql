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

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO slackgauntlet;

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
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "channelId" text,
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
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."Message" (id, content, "createdAt", "updatedAt", "userId", "channelId", "recipientId", "parentId", "replyCount") FROM stdin;
cm5webycs00013e1i7rjauakz	Hey, how are you?	2025-01-14 11:35:11.788	2025-01-14 11:35:11.788	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	\N	\N	0
cm5wgbzzl00063emsjb5xo3cp	Can you help me with the project?	2025-01-14 12:31:13.136	2025-01-14 12:31:13.136	cm5wcp81a00063euywix6zte8	\N	cm5wcp81a00053euyt3p32nhe	\N	0
cm5wgd9pj000a3emso2obyvdc	I'm good, thanks! How about you?	2025-01-14 12:32:12.389	2025-01-14 12:32:12.389	cm5wcp81a00053euyt3p32nhe	cm5wd0ign00003euc9t8mukj9	\N	\N	0
cm5wgdrib000g3ems2md66768	Sure setup a meeting to discuss	2025-01-14 12:32:35.459	2025-01-14 12:32:35.459	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0
cm5wgeohz000k3emsaqo1dwnt	Do you to in the project meeting with marcai?	2025-01-14 12:33:18.214	2025-01-14 12:33:18.214	cm5wcp81a00063euywix6zte8	\N	cm5wcp81900043euykpvmf9pf	\N	0
cm5wkt15g00013e5myktj2e6a	A new chat, without all all the nonsense!	2025-01-14 14:36:26.259	2025-01-14 14:36:26.259	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	\N	\N	0
cm5wkvaka00053e5m2ukcr7oz	Dis you setup a meeting?	2025-01-14 14:38:11.769	2025-01-14 14:38:11.769	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0
cm5wkyo9r00013edin5wpo4as	What if someone posts nonsense?	2025-01-14 14:40:49.503	2025-01-14 14:40:49.503	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0
cm5wli7m000013e16pvnmz5hm	Did you setup the meeting, I did not get an invite?	2025-01-14 14:56:01.032	2025-01-14 14:56:01.032	cm5wcp81a00053euyt3p32nhe	\N	cm5wcp81a00063euywix6zte8	\N	0
cm5wmgfcn00013elpz3majupx	hey, I'm busy	2025-01-14 15:22:37.367	2025-01-14 15:22:37.367	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0
cm5wmlqd500053elpfxordl7j	still very busy	2025-01-14 15:26:44.921	2025-01-14 15:26:44.921	cm5wcp81a00053euyt3p32nhe	cm5wgbes000003ems4aeblqp1	\N	\N	0
\.


--
-- Data for Name: MessageRead; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."MessageRead" (id, "messageId", "userId", "channelId", "createdAt", "updatedAt") FROM stdin;
cm5webycz00023e1inl4vmt3x	cm5webycs00013e1i7rjauakz	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-14 11:35:11.795	2025-01-14 11:35:11.795
cm5webycz00033e1ikmn867zr	cm5webycs00013e1i7rjauakz	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-14 11:35:11.795	2025-01-14 11:35:11.795
cm5webycz00053e1ir1trf8d2	cm5webycs00013e1i7rjauakz	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	2025-01-14 11:35:11.795	2025-01-14 11:35:11.795
cm5wgd9po000b3emsi6m67hrd	cm5wgd9pj000a3emso2obyvdc	cm5wcp81a00063euywix6zte8	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wgd9po000c3emsnn4k2hqm	cm5wgd9pj000a3emso2obyvdc	cm5wcl72500023euyb67ri0aj	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wgd9po000d3emsdsxrt52a	cm5wgd9pj000a3emso2obyvdc	cm5wcl72600033euyoz4hsvqn	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wgd9po000e3emszicz2e7x	cm5wgd9pj000a3emso2obyvdc	cm5wcp81900043euykpvmf9pf	cm5wd0ign00003euc9t8mukj9	2025-01-14 12:32:12.396	2025-01-14 12:32:12.396
cm5wgeoi8000m3emsdi7fv8f9	cm5wgeohz000k3emsaqo1dwnt	cm5wcp81900043euykpvmf9pf	\N	2025-01-14 12:33:18.225	2025-01-14 12:33:18.225
cm5wkt15q00033e5mfpeznkf2	cm5wkt15g00013e5myktj2e6a	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 14:36:26.271	2025-01-14 14:36:26.271
cm5wkyoa300033edijt9jz2xu	cm5wkyo9r00013edin5wpo4as	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 14:40:49.516	2025-01-14 14:40:49.516
cm5wmgfcx00023elpptnwx1rx	cm5wmgfcn00013elpz3majupx	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	2025-01-14 15:22:37.377	2025-01-14 15:22:37.377
cm5wmgfcx00033elpbnjnt1lp	cm5wmgfcn00013elpz3majupx	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 15:22:37.377	2025-01-14 15:22:37.377
cm5wmlqdg00063elpdhiz9997	cm5wmlqd500053elpfxordl7j	cm5wcp81a00063euywix6zte8	cm5wgbes000003ems4aeblqp1	2025-01-14 15:26:44.933	2025-01-14 15:26:44.933
cm5wmlqdg00073elp0io03ozq	cm5wmlqd500053elpfxordl7j	cm5wcp81900043euykpvmf9pf	cm5wgbes000003ems4aeblqp1	2025-01-14 15:26:44.933	2025-01-14 15:26:44.933
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public."User" (id, username, "firstName", "lastName", email, "profilePicture", "userRole", "createdAt", "updatedAt", status, "statusMessage", "useAIResponse") FROM stdin;
cm5wcl72500023euyb67ri0aj	ducko	Duck	One	sneer-chip-running@duck.com	\N	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.304	\N	\N	f
cm5wcl72600033euyoz4hsvqn	duckt	Duck	Two	handling-nag-duvet@duck.com	\N	USER	2025-01-14 10:46:23.742	2025-01-14 11:21:38.305	\N	\N	f
cm5wcp81900043euykpvmf9pf	marcg	Marc	B	marc.breneiser@gmail.com	\N	USER	2025-01-14 10:49:31.63	2025-01-14 11:21:38.305	\N	\N	f
cm5wcp81a00063euywix6zte8	billw	Bill	Williams	ridden-keep-robin@duck.com	\N	USER	2025-01-14 10:49:31.63	2025-01-14 15:11:18.455	busy	\N	f
cm5wcp81a00053euyt3p32nhe	marcai	Marc	Gai	marc.breneiser@gauntletai.com	\N	USER	2025-01-14 10:49:31.63	2025-01-14 16:45:11.312	available	\N	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: slackgauntlet
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
14d74ed9-e121-4121-b548-73f7050fbfc7	891688218214e9d53a6db49144d14b26f224d15dfcd6876e6302bfe869d8ffd3	2025-01-14 05:43:48.924343-05	20250114104348_user_status	\N	\N	2025-01-14 05:43:48.82898-05	1
1f0e6fce-e89d-498e-bdf5-bbbb36ea9547	ab8f3dcebd564f31b2f5d0edc9dc33b28e1526bd18f9f87146997ad02b802f38	2025-01-14 07:23:58.385319-05	20250114122357_status_updates	\N	\N	2025-01-14 07:23:58.374441-05	1
9ccc529e-956a-4df6-919f-3bccbab05dda	bc4fef9badea13b0de7e8bf1d2fe16e5d2a4ebf53513efe07791b931aa8800a6	2025-01-14 11:35:36.990976-05	20250114162945_status_updates	\N	\N	2025-01-14 11:35:36.985558-05	1
b52586b6-aac0-461d-9050-9f86b00bc24d	db680656dcc1753e1b8c492c2241f666537073e5aff106565647f413c99d8b32	2025-01-14 11:35:58.622058-05	20250114163537_status_updates	\N	\N	2025-01-14 11:35:58.614737-05	1
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


--
-- PostgreSQL database dump complete
--

