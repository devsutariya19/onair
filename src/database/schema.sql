CREATE TABLE public.cues (
  id character varying NOT NULL DEFAULT "substring"((gen_random_uuid())::text, 1, 8),
  session_id character varying NOT NULL,
  title text NOT NULL,
  speaker text NOT NULL,
  duration integer NOT NULL,
  remaining_time integer NOT NULL,
  status text NOT NULL DEFAULT 'queued'::text,
  order integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_modified timestamp with time zone DEFAULT now(),
  is_playing boolean DEFAULT false,
  CONSTRAINT cues_pkey PRIMARY KEY (id),
  CONSTRAINT cues_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);

CREATE TABLE public.devices (
  id character varying NOT NULL DEFAULT "substring"((gen_random_uuid())::text, 1, 8),
  session_id character varying,
  name text NOT NULL,
  CONSTRAINT devices_pkey PRIMARY KEY (id),
  CONSTRAINT devices_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);

CREATE TABLE public.messages (
  id character varying NOT NULL DEFAULT "substring"((gen_random_uuid())::text, 1, 8),
  session_id character varying,
  message text NOT NULL,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);

CREATE TABLE public.sessions (
  id character varying NOT NULL DEFAULT "substring"((gen_random_uuid())::text, 1, 8),
  title text NOT NULL,
  segments integer NOT NULL DEFAULT 0,
  total_duration interval NOT NULL,
  status text NOT NULL DEFAULT 'Not Started'::text,
  last_modified timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sessions_pkey PRIMARY KEY (id)
);