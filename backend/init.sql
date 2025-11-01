CREATE TABLE IF NOT EXISTS response_cache (
    id SERIAL PRIMARY KEY,
    cache_key VARCHAR(64) NOT NULL,
    model VARCHAR(100) NOT NULL,
    response_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_cache_entry UNIQUE (cache_key, model)
);
CREATE INDEX IF NOT EXISTS idx_cache_key ON response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_model ON response_cache(model);
CREATE INDEX IF NOT EXISTS idx_created_at ON response_cache(created_at DESC);
COMMENT ON TABLE response_cache IS 'Stores cached ChatGPT API responses keyed by SHA256 hash of input payload';
COMMENT ON COLUMN response_cache.cache_key IS 'SHA256 hash of the normalized input payload';
COMMENT ON COLUMN response_cache.model IS 'OpenAI model identifier';
COMMENT ON COLUMN response_cache.response_json IS 'Full JSON response from ChatGPT API';
COMMENT ON COLUMN response_cache.created_at IS 'Timestamp when cache entry was first created';
COMMENT ON COLUMN response_cache.updated_at IS 'Timestamp when cache entry was last updated';
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_response_cache_updated_at
    BEFORE UPDATE ON response_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE VIEW cache_statistics AS
SELECT
    COUNT(*) as total_entries,
    COUNT(DISTINCT model) as unique_models,
    COUNT(DISTINCT DATE(created_at)) as days_active,
    MAX(created_at) as latest_entry,
    MIN(created_at) as oldest_entry,
    pg_size_pretty(pg_total_relation_size('response_cache')) as table_size
FROM response_cache;
COMMENT ON VIEW cache_statistics IS 'Provides overview statistics of the response cache';
