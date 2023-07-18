
CREATE TABLE engineer_to_manager_badge_candidature_proposals (
  id SERIAL PRIMARY KEY, 
  manager INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  badge_id INTEGER NOT NULL,
  badge_version TIMESTAMP NOT NULL,
  proposal_description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (badge_id, badge_version) REFERENCES badges_versions(id, created_at)
);

CREATE TABLE manager_badge_candidature_proposal_response (
  response_id SERIAL PRIMARY KEY,
  is_approved BOOLEAN NOT NULL,
  disapproval_motivation VARCHAR(255) DEFAULT NULL,
  proposal_id INTEGER NOT NULL REFERENCES engineer_to_manager_badge_candidature_proposals(id) ON DELETE RESTRICT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE badge_candidature_request (
  id SERIAL PRIMARY KEY,
  is_issued BOOLEAN NOT NULL,
  badge_id INTEGER NOT NULL,
  badge_version TIMESTAMP NOT NULL,
  engineer_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  candidature_evidences JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE issuing_requests (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES badge_candidature_request(id) ON DELETE RESTRICT,
  is_approved BOOLEAN DEFAULT NULL,
  disapproval_motivation VARCHAR(255) DEFAULT NULL
);

CREATE VIEW badge_candidature_view AS
SELECT
  bcr.id,
  bcr.is_issued,
  bcr.badge_id,
  bcr.badge_version,
  bv.title AS badge_title,
  bv.description AS badge_description,
  bv.requirements AS badge_requirements,
  u.name AS engineer_name,
  u.id AS engineer_id,
  bcr.manager_id,
  bcr.candidature_evidences,
  bcr.created_at
FROM
  badge_candidature_request AS bcr
  JOIN badges_versions AS bv ON bcr.badge_id = bv.id AND bcr.badge_version = bv.created_at
  JOIN users AS u ON bcr.engineer_id = u.id;


CREATE VIEW issuing_requests_view AS
SELECT
  bcr.id,
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
FROM
  badge_candidature_request bcr
  JOIN users u ON bcr.engineer_id = u.id
  JOIN badges_definitions bd ON bcr.badge_id = bd.id AND bcr.badge_version = bd.created_at
WHERE
  EXISTS (
    SELECT 1
    FROM issuing_requests ir
    WHERE ir.request_id = bcr.id
  );




CREATE OR REPLACE FUNCTION get_pending_proposals_for_engineer(engineerId INTEGER)
  RETURNS SETOF engineer_to_manager_badge_candidature_proposals AS
$$
BEGIN
  RETURN QUERY
    SELECT *
    FROM engineer_to_manager_badge_candidature_proposals
    WHERE id NOT IN (
      SELECT proposal_id
      FROM manager_badge_candidature_proposal_response
    )
    AND created_by = engineerId;

  RETURN;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE PROCEDURE insert_candidature_request(
  proposal_badge_id INTEGER,
  proposal_badge_version TIMESTAMP,
  proposal_id INTEGER,
  is_approved BOOLEAN,
  created_by INTEGER
)
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
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION insert_badge_candidature_request()
  RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_issuing_request()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_issued = TRUE THEN
    INSERT INTO issuing_requests (request_id)
    VALUES (NEW.id);
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_issuing_requests_for_manager(managerId INTEGER)
  RETURNS SETOF issuing_requests_view AS
$$
BEGIN
  RETURN QUERY
    SELECT *
    FROM issuing_requests_view
    WHERE manager_id = managerId;

  RETURN;
END;
$$ LANGUAGE plpgsql;




CREATE TRIGGER manager_badge_candidature_proposal_response_trigger
AFTER INSERT ON manager_badge_candidature_proposal_response
FOR EACH ROW
EXECUTE FUNCTION insert_badge_candidature_request();

CREATE TRIGGER engineer_badge_candidature_proposal_response_trigger
AFTER INSERT ON engineer_badge_candidature_proposal_response
FOR EACH ROW
EXECUTE FUNCTION insert_badge_candidature_request();


CREATE TRIGGER insert_issuing_request_trigger
AFTER UPDATE ON badge_candidature_request
FOR EACH ROW
EXECUTE FUNCTION insert_issuing_request();

