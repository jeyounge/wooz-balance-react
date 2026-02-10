
-- PostgREST 스키마 캐시 강제 새로고침
NOTIFY pgrst, 'reload config';
