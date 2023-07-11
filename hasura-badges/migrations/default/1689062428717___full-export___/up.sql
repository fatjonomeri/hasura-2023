SET check_function_bodies = false;
CREATE TABLE public.badges_versions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer NOT NULL,
    title character varying(255),
    description text,
    requirements jsonb
);
CREATE FUNCTION public._create_badge_version(user_id integer, badge_def_id integer, version_at timestamp without time zone) RETURNS SETOF public.badges_versions
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  INSERT INTO "badges_versions"(
    "id", 
    "title", 
    "description", 
    "requirements", 
    "created_at",
    "created_by"
  )
  SELECT 
    "bd"."id", 
    "bd"."title", 
    "bd"."description", 
    coalesce(
        json_agg(
            json_build_object(
                'id', "rd"."id", 
                'title', "rd"."title", 
                'description', "rd"."description"
            ) 
            ORDER BY "rd"."id"
        ) FILTER (WHERE "rd"."id" IS NOT NULL),
        '[]'::json
    ) AS "requirements",
    version_at, 
    user_id
  FROM "badges_definitions" "bd"
  LEFT JOIN "requirements_definitions" "rd" ON "bd"."id" = "rd"."badge_id"
  WHERE "bd"."id" = "badge_def_id"
  GROUP BY "bd"."id", "bd"."title", "bd"."description"
  RETURNING *;
END; $$;
CREATE FUNCTION public.create_badge_version(hasura_session json, badge_def_id integer) RETURNS SETOF public.badges_versions
    LANGUAGE plpgsql
    AS $$
DECLARE
  tenant_id integer := (hasura_session ->> 'x-hasura-tenant-id')::integer;
BEGIN
  RETURN QUERY
  SELECT * FROM _create_badge_version(tenant_id, badge_def_id, (SELECT now() AT TIME ZONE 'UTC'));
END; $$;
CREATE TABLE public.engineer_badge_candidature_proposal_response (
    response_id integer NOT NULL,
    is_approved boolean NOT NULL,
    disapproval_motivation character varying(255) DEFAULT NULL::character varying,
    proposal_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer
);
CREATE FUNCTION public.get_approved_responses_by_manager(manager_id integer) RETURNS SETOF public.engineer_badge_candidature_proposal_response
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM engineer_badge_candidature_proposal_response
  WHERE created_by = manager_id AND is_approved = TRUE;
END;
$$;
CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    roles jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    modified_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE FUNCTION public.get_engineers_by_manager(manager_id integer) RETURNS SETOF public.users
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT u.*
    FROM public.users_relations r
    INNER JOIN public.users u ON r.engineer = u.id
    WHERE r.manager = manager_id;
END;
$$;
CREATE TABLE public.badge_candidature_request (
    id integer NOT NULL,
    is_issued boolean NOT NULL,
    badge_id integer NOT NULL,
    badge_version timestamp without time zone NOT NULL,
    engineer_id integer NOT NULL,
    manager_id integer NOT NULL,
    candidature_evidences jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.badges_definitions (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer,
    modified_at timestamp without time zone DEFAULT now() NOT NULL,
    modified_by integer
);
CREATE TABLE public.issuing_requests (
    id integer NOT NULL,
    request_id integer NOT NULL,
    is_approved boolean,
    disapproval_motivation character varying(255) DEFAULT NULL::character varying
);
CREATE VIEW public.issuing_requests_view AS
 SELECT bcr.id,
    bcr.is_issued,
    bcr.badge_id,
    bd.title AS badge_title,
    bd.description AS badge_description,
    bcr.badge_version,
    bcr.engineer_id,
    u.name AS engineer_name,
    bcr.manager_id,
    bcr.candidature_evidences,
    bcr.created_at
   FROM ((public.badge_candidature_request bcr
     JOIN public.users u ON ((bcr.engineer_id = u.id)))
     JOIN public.badges_definitions bd ON (((bcr.badge_id = bd.id) AND (bcr.badge_version = bd.created_at))))
  WHERE (EXISTS ( SELECT 1
           FROM public.issuing_requests ir
          WHERE (ir.request_id = bcr.id)));
CREATE FUNCTION public.get_issuing_requests_for_manager(managerid integer) RETURNS SETOF public.issuing_requests_view
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM issuing_requests_view
    WHERE manager_id = managerId;
  RETURN;
END;
$$;
CREATE TABLE public.engineer_to_manager_badge_candidature_proposals (
    id integer NOT NULL,
    manager integer NOT NULL,
    badge_id integer NOT NULL,
    badge_version timestamp without time zone NOT NULL,
    proposal_description character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer
);
CREATE FUNCTION public.get_pending_proposals_for_engineer(engineerid integer) RETURNS SETOF public.engineer_to_manager_badge_candidature_proposals
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM engineer_to_manager_badge_candidature_proposals
    WHERE id NOT IN (
      SELECT proposal_id
      FROM engineer_badge_candidature_proposal_response
    )
    AND created_by = engineerId;
  RETURN;
END;
$$;
CREATE FUNCTION public.insert_badge_candidature_request() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  proposal_badge_id INTEGER;
  proposal_badge_version TIMESTAMP;
BEGIN
  IF TG_TABLE_NAME = 'manager_badge_candidature_proposal_response' AND NEW.is_approved = TRUE THEN
    SELECT badge_id, badge_version
    INTO proposal_badge_id, proposal_badge_version
    FROM engineer_to_manager_badge_candidature_proposals
    WHERE id = NEW.proposal_id;
  ELSIF TG_TABLE_NAME = 'engineer_badge_candidature_proposal_response' AND NEW.is_approved = TRUE THEN
    SELECT badge_id, badge_version
    INTO proposal_badge_id, proposal_badge_version
    FROM manager_to_engineer_badge_candidature_proposals
    WHERE id = NEW.proposal_id;
  END IF;
  CALL insert_candidature_request(
    proposal_badge_id,
    proposal_badge_version,
    NEW.proposal_id,
    NEW.is_approved,
    NEW.created_by
  );
  RETURN NULL;
END;
$$;
CREATE PROCEDURE public.insert_candidature_request(IN proposal_badge_id integer, IN proposal_badge_version timestamp without time zone, IN proposal_id integer, IN is_approved boolean, IN created_by integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF is_approved = TRUE THEN
    INSERT INTO badge_candidature_request (
      is_issued,
      badge_id,
      badge_version,
      engineer_id,
      manager_id,
      candidature_evidences
    )
    SELECT
      FALSE AS is_issued,
      proposal_badge_id,
      proposal_badge_version,
      COALESCE(embc.created_by, mebc.engineer) AS engineer_id,
      COALESCE(embc.manager, mebc.created_by) AS manager_id,
      NULL AS candidature_evidences
    FROM
      badges_versions bv
      LEFT JOIN engineer_to_manager_badge_candidature_proposals embc ON embc.id = proposal_id
      LEFT JOIN manager_to_engineer_badge_candidature_proposals mebc ON mebc.id = proposal_id
    WHERE
      bv.id = proposal_badge_id
      AND bv.created_at = proposal_badge_version;
  END IF;
END;
$$;
CREATE FUNCTION public.insert_issuing_request() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.is_issued = TRUE THEN
    INSERT INTO issuing_requests (request_id)
    VALUES (NEW.id);
  END IF;
  RETURN NULL;
END;
$$;
CREATE FUNCTION public.trigger_audit_trail() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "audit_trails"(
    schema_name,
    table_name,
    op_name,
    value_old,
    value_new,
    info
  ) VALUES(
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    json_build_object('active_connections', (SELECT COUNT(*) FROM pg_stat_activity), 'current_database', current_database(), 'client_ip', inet_client_addr())
  );
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;
CREATE FUNCTION public.trigger_prevent_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  RAISE EXCEPTION 'Updates and deletes are not allowed on this table';
END;
$$;
CREATE TABLE public.audit_trails (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4(),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by text DEFAULT CURRENT_USER,
    schema_name text,
    table_name text,
    op_name text,
    value_old jsonb,
    value_new jsonb,
    info jsonb
);
CREATE SEQUENCE public.audit_trails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.audit_trails_id_seq OWNED BY public.audit_trails.id;
CREATE SEQUENCE public.badge_candidature_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.badge_candidature_request_id_seq OWNED BY public.badge_candidature_request.id;
CREATE VIEW public.badge_candidature_view AS
 SELECT bcr.id,
    bcr.is_issued,
    bcr.badge_id,
    bcr.badge_version,
    bv.title AS badge_title,
    bv.description AS badge_description,
    bv.requirements AS badge_requirements,
    u.name AS engineer_name,
    bcr.manager_id,
    bcr.candidature_evidences,
    bcr.created_at
   FROM ((public.badge_candidature_request bcr
     JOIN public.badges_versions bv ON (((bcr.badge_id = bv.id) AND (bcr.badge_version = bv.created_at))))
     JOIN public.users u ON ((bcr.engineer_id = u.id)));
CREATE SEQUENCE public.badges_definitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.badges_definitions_id_seq OWNED BY public.badges_definitions.id;
CREATE VIEW public.badges_versions_last AS
 SELECT DISTINCT ON (badges_versions.id) badges_versions.id,
    badges_versions.created_at,
    badges_versions.created_by,
    badges_versions.title,
    badges_versions.description,
    badges_versions.requirements
   FROM public.badges_versions
  ORDER BY badges_versions.id, badges_versions.created_at DESC;
CREATE SEQUENCE public.engineer_badge_candidature_proposal_response_response_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.engineer_badge_candidature_proposal_response_response_id_seq OWNED BY public.engineer_badge_candidature_proposal_response.response_id;
CREATE SEQUENCE public.engineer_to_manager_badge_candidature_proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.engineer_to_manager_badge_candidature_proposals_id_seq OWNED BY public.engineer_to_manager_badge_candidature_proposals.id;
CREATE TABLE public.users_relations (
    manager integer NOT NULL,
    engineer integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer
);
CREATE VIEW public.engineering_teams AS
 SELECT u.id AS manager_id,
    u.name AS manager_name,
    json_agg(json_build_object('id', ur.engineer, 'name', e.name, 'created_at', ur.created_at)) AS items
   FROM ((public.users u
     JOIN public.users_relations ur ON ((u.id = ur.manager)))
     JOIN public.users e ON ((ur.engineer = e.id)))
  WHERE (u.roles @> '["manager"]'::jsonb)
  GROUP BY u.id, u.name;
CREATE VIEW public.engineers AS
 SELECT users.id,
    users.name
   FROM public.users
  WHERE (users.roles @> '["engineer"]'::jsonb);
CREATE SEQUENCE public.issuing_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.issuing_requests_id_seq OWNED BY public.issuing_requests.id;
CREATE TABLE public.manager_badge_candidature_proposal_response (
    response_id integer NOT NULL,
    is_approved boolean NOT NULL,
    disapproval_motivation character varying(255) DEFAULT NULL::character varying,
    proposal_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer
);
CREATE SEQUENCE public.manager_badge_candidature_proposal_response_response_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.manager_badge_candidature_proposal_response_response_id_seq OWNED BY public.manager_badge_candidature_proposal_response.response_id;
CREATE TABLE public.manager_to_engineer_badge_candidature_proposals (
    id integer NOT NULL,
    engineer integer NOT NULL,
    badge_id integer NOT NULL,
    badge_version timestamp without time zone NOT NULL,
    proposal_description character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer
);
CREATE SEQUENCE public.manager_to_engineer_badge_candidature_proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.manager_to_engineer_badge_candidature_proposals_id_seq OWNED BY public.manager_to_engineer_badge_candidature_proposals.id;
CREATE VIEW public.managers AS
 SELECT users.id,
    users.name
   FROM public.users
  WHERE (users.roles @> '["manager"]'::jsonb);
CREATE TABLE public.requirements_definitions (
    id integer NOT NULL,
    badge_id integer,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer,
    modified_at timestamp without time zone DEFAULT now() NOT NULL,
    modified_by integer
);
CREATE SEQUENCE public.requirements_definitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.requirements_definitions_id_seq OWNED BY public.requirements_definitions.id;
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.audit_trails ALTER COLUMN id SET DEFAULT nextval('public.audit_trails_id_seq'::regclass);
ALTER TABLE ONLY public.badge_candidature_request ALTER COLUMN id SET DEFAULT nextval('public.badge_candidature_request_id_seq'::regclass);
ALTER TABLE ONLY public.badges_definitions ALTER COLUMN id SET DEFAULT nextval('public.badges_definitions_id_seq'::regclass);
ALTER TABLE ONLY public.engineer_badge_candidature_proposal_response ALTER COLUMN response_id SET DEFAULT nextval('public.engineer_badge_candidature_proposal_response_response_id_seq'::regclass);
ALTER TABLE ONLY public.engineer_to_manager_badge_candidature_proposals ALTER COLUMN id SET DEFAULT nextval('public.engineer_to_manager_badge_candidature_proposals_id_seq'::regclass);
ALTER TABLE ONLY public.issuing_requests ALTER COLUMN id SET DEFAULT nextval('public.issuing_requests_id_seq'::regclass);
ALTER TABLE ONLY public.manager_badge_candidature_proposal_response ALTER COLUMN response_id SET DEFAULT nextval('public.manager_badge_candidature_proposal_response_response_id_seq'::regclass);
ALTER TABLE ONLY public.manager_to_engineer_badge_candidature_proposals ALTER COLUMN id SET DEFAULT nextval('public.manager_to_engineer_badge_candidature_proposals_id_seq'::regclass);
ALTER TABLE ONLY public.requirements_definitions ALTER COLUMN id SET DEFAULT nextval('public.requirements_definitions_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.audit_trails
    ADD CONSTRAINT audit_trails_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.audit_trails
    ADD CONSTRAINT audit_trails_uuid_key UNIQUE (uuid);
ALTER TABLE ONLY public.badge_candidature_request
    ADD CONSTRAINT badge_candidature_request_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.badges_definitions
    ADD CONSTRAINT badges_definitions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.badges_versions
    ADD CONSTRAINT badges_versions_pkey PRIMARY KEY (id, created_at);
ALTER TABLE ONLY public.engineer_badge_candidature_proposal_response
    ADD CONSTRAINT engineer_badge_candidature_proposal_response_pkey PRIMARY KEY (response_id);
ALTER TABLE ONLY public.engineer_to_manager_badge_candidature_proposals
    ADD CONSTRAINT engineer_to_manager_badge_candidature_proposals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.issuing_requests
    ADD CONSTRAINT issuing_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.manager_badge_candidature_proposal_response
    ADD CONSTRAINT manager_badge_candidature_proposal_response_pkey PRIMARY KEY (response_id);
ALTER TABLE ONLY public.manager_to_engineer_badge_candidature_proposals
    ADD CONSTRAINT manager_to_engineer_badge_candidature_proposals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.requirements_definitions
    ADD CONSTRAINT requirements_definitions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users_relations
    ADD CONSTRAINT users_relations_pkey PRIMARY KEY (manager, engineer);
CREATE TRIGGER audit_trails_immutable BEFORE DELETE OR UPDATE ON public.audit_trails FOR EACH ROW EXECUTE FUNCTION public.trigger_prevent_changes();
CREATE TRIGGER badges_definitions_audit_trail_trg AFTER INSERT OR DELETE OR UPDATE ON public.badges_definitions FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_trail();
CREATE TRIGGER badges_versions_immutable BEFORE DELETE OR UPDATE ON public.badges_versions FOR EACH ROW EXECUTE FUNCTION public.trigger_prevent_changes();
CREATE TRIGGER engineer_badge_candidature_proposal_response_trigger AFTER INSERT ON public.engineer_badge_candidature_proposal_response FOR EACH ROW EXECUTE FUNCTION public.insert_badge_candidature_request();
CREATE TRIGGER insert_issuing_request_trigger AFTER UPDATE ON public.badge_candidature_request FOR EACH ROW EXECUTE FUNCTION public.insert_issuing_request();
CREATE TRIGGER manager_badge_candidature_proposal_response_trigger AFTER INSERT ON public.manager_badge_candidature_proposal_response FOR EACH ROW EXECUTE FUNCTION public.insert_badge_candidature_request();
CREATE TRIGGER requirements_definitions_audit_trail_trg AFTER INSERT OR DELETE OR UPDATE ON public.requirements_definitions FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_trail();
CREATE TRIGGER users_audit_trail_trg AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_trail();
CREATE TRIGGER users_relations_audit_trail_trg AFTER INSERT OR DELETE OR UPDATE ON public.users_relations FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_trail();
ALTER TABLE ONLY public.badges_definitions
    ADD CONSTRAINT badges_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.badges_definitions
    ADD CONSTRAINT badges_definitions_modified_by_fkey FOREIGN KEY (modified_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.badges_versions
    ADD CONSTRAINT badges_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.engineer_badge_candidature_proposal_response
    ADD CONSTRAINT engineer_badge_candidature_proposal_response_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.engineer_badge_candidature_proposal_response
    ADD CONSTRAINT engineer_badge_candidature_proposal_response_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.manager_to_engineer_badge_candidature_proposals(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.engineer_to_manager_badge_candidature_proposals
    ADD CONSTRAINT engineer_to_manager_badge_candidatu_badge_id_badge_version_fkey FOREIGN KEY (badge_id, badge_version) REFERENCES public.badges_versions(id, created_at);
ALTER TABLE ONLY public.engineer_to_manager_badge_candidature_proposals
    ADD CONSTRAINT engineer_to_manager_badge_candidature_proposals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.engineer_to_manager_badge_candidature_proposals
    ADD CONSTRAINT engineer_to_manager_badge_candidature_proposals_manager_fkey FOREIGN KEY (manager) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.issuing_requests
    ADD CONSTRAINT issuing_requests_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.badge_candidature_request(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.manager_badge_candidature_proposal_response
    ADD CONSTRAINT manager_badge_candidature_proposal_response_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.manager_badge_candidature_proposal_response
    ADD CONSTRAINT manager_badge_candidature_proposal_response_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.engineer_to_manager_badge_candidature_proposals(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.manager_to_engineer_badge_candidature_proposals
    ADD CONSTRAINT manager_to_engineer_badge_candidatu_badge_id_badge_version_fkey FOREIGN KEY (badge_id, badge_version) REFERENCES public.badges_versions(id, created_at);
ALTER TABLE ONLY public.manager_to_engineer_badge_candidature_proposals
    ADD CONSTRAINT manager_to_engineer_badge_candidature_proposals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.manager_to_engineer_badge_candidature_proposals
    ADD CONSTRAINT manager_to_engineer_badge_candidature_proposals_engineer_fkey FOREIGN KEY (engineer) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.requirements_definitions
    ADD CONSTRAINT requirements_definitions_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges_definitions(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.requirements_definitions
    ADD CONSTRAINT requirements_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.requirements_definitions
    ADD CONSTRAINT requirements_definitions_modified_by_fkey FOREIGN KEY (modified_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_relations
    ADD CONSTRAINT users_relations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.users_relations
    ADD CONSTRAINT users_relations_engineer_fkey FOREIGN KEY (engineer) REFERENCES public.users(id);
ALTER TABLE ONLY public.users_relations
    ADD CONSTRAINT users_relations_manager_fkey FOREIGN KEY (manager) REFERENCES public.users(id);
