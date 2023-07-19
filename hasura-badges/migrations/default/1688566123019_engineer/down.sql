DROP FUNCTION IF EXISTS "get_issuing_requests_for_manager";
DROP FUNCTION IF EXISTS "insert_issuing_request";
DROP FUNCTION IF EXISTS "insert_badge_candidature_request";
DROP FUNCTION IF EXISTS "get_pending_proposals_for_manager";

DROP PROCEDURE IF EXISTS "insert_candidature_request";

DROP TRIGGER IF EXISTS "insert_issuing_request_trigger" ON "badge_candidature_request";
DROP TRIGGER IF EXISTS "manager_badge_candidature_proposal_response_trigger" ON "manager_badge_candidature_proposal_response";
DROP TRIGGER IF EXISTS "engineer_badge_candidature_proposal_response_trigger" ON "engineer_badge_candidature_proposal_response";

DROP VIEW IF EXISTS "issuing_requests_view"  
DROP VIEW IF EXISTS "badge_candidature_view"  

DROP TABLE IF EXISTS "issuing_requests";
DROP TABLE IF EXISTS "badge_candidature_request";
DROP TABLE IF EXISTS "manager_badge_candidature_proposal_response";
DROP TABLE IF EXISTS "engineer_to_manager_badge_candidature_proposals";
