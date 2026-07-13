CREATE OR REPLACE FUNCTION refresh_league_percentiles(target_league_id UUID)
RETURNS VOID AS $$
DECLARE
  total_aspirants INT;
BEGIN
  SELECT COUNT(*) INTO total_aspirants 
  FROM standings 
  WHERE league_id = target_league_id;

  UPDATE standings
  SET percentile = ROUND(((total_aspirants - rank_position)::NUMERIC / total_aspirants::NUMERIC) * 100, 2)
  WHERE league_id = target_league_id;
END;
$$ LANGUAGE plpgsql;
