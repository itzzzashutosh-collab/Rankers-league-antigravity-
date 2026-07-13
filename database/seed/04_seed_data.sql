INSERT INTO championships (id, title, category, description, scheduled_start, scheduled_end, entry_fee_credits, max_participants, current_participants, status, rewards_pool_credits, difficulty_tier)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Civil Services Elite League', 'Civil Services', 'High-fidelity civil services preliminary examination replication.', '2026-07-09 09:30:00+00', '2026-07-09 11:30:00+00', 500, 50000, 38492, 'active', 50000, 'elite'),
  ('00000000-0000-0000-0000-000000000002', 'IIT JEE Engineering Apex Championship', 'Engineering', 'Apex caliber evaluation for engineering aspirants.', '2026-07-12 14:00:00+00', '2026-07-12 17:00:00+00', 300, 80000, 52100, 'upcoming', 75000, 'apex');

INSERT INTO standings (league_id, aspirant_name, aspirant_tier, rank_position, percentile, total_score, accuracy_rate, duration_seconds)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'Grandmaster', 1, 99.99, 184.50, 96.20, 6720),
  ('00000000-0000-0000-0000-000000000001', 'Meera Nair', 'Grandmaster', 2, 99.98, 181.00, 94.80, 6480);
