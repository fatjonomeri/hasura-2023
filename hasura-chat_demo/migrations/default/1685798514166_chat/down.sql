DROP FUNCTION send_message_to_user(integer,integer,text);
DROP FUNCTION get_messages_by_receiver(integer);
DROP FUNCTION IF EXISTS sign_in(TEXT, TEXT);
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
