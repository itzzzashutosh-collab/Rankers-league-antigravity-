-- Seed Data for Completed Contests, Registrations, Exam Sessions & Payouts

-- 1. Seed contest results list
INSERT INTO contest_results (contest_id, title, category, exam_name, contest_date, participants_count, entry_fee, max_score, total_questions, winning_cutoff_score, winning_cutoff_rank, result_status)
VALUES
  ('upsc-elite-live', 'Civil Services General Studies Elite Championship', 'UPSC', 'UPSC CSE Prelims', 'July 7, 2026', 120, 500, 300, 150, 198, 60, 'published'),
  ('jee-advanced-live', 'IIT JEE Math Apex Championship', 'JEE Advanced', 'JEE Advanced Paper 1', 'July 5, 2026', 250, 1000, 360, 90, 242, 125, 'final'),
  ('neet-prime-live', 'NEET Biology Prime Championship', 'NEET', 'NEET UG Biology', 'July 6, 2026', 400, 300, 720, 180, 590, 200, 'published');

-- 2. Seed contest registrations (including current user 'aspirant101' and others)
INSERT INTO contest_registrations (contest_id, username, mobile_number, secret_code, verification_status, lobby_joined_at)
VALUES
  ('upsc-elite-live', 'aspirant101', '9876543210', 'SEC-9980', 'verified', NOW() - INTERVAL '1 hour'),
  ('upsc-elite-live', 'aspirant_delhi', '9998887770', 'SEC-1002', 'verified', NOW() - INTERVAL '1 hour'),
  ('upsc-elite-live', 'ias_dreamer', '9123456789', 'SEC-8827', 'verified', NOW() - INTERVAL '1 hour'),
  ('jee-advanced-live', 'aspirant101', '9876543210', 'SEC-9980', 'verified', NOW() - INTERVAL '2 days'),
  ('jee-advanced-live', 'iit_bombay_elite', '9000000001', 'SEC-7761', 'verified', NOW() - INTERVAL '2 days'),
  ('neet-prime-live', 'aspirant101', '9876543210', 'SEC-9980', 'verified', NOW() - INTERVAL '1 day'),
  ('neet-prime-live', 'doctor_hopeful', '9000000002', 'SEC-3321', 'verified', NOW() - INTERVAL '1 day');

-- 3. Seed dynamic exam responses (responses saved during live testing)
INSERT INTO contest_exam_sessions (contest_id, username, saved_answers, time_remaining_seconds, fullscreen_exit_count, connection_status, is_submitted, submitted_at)
VALUES
  ('upsc-elite-live', 'aspirant101', '{"0": "A", "1": "C", "2": "B", "3": "D", "12": "A"}', 450, 0, 'connected', TRUE, NOW() - INTERVAL '40 minutes'),
  ('jee-advanced-live', 'aspirant101', '{"0": "B", "1": "B", "2": "C", "3": "A"}', 0, 2, 'connected', TRUE, NOW() - INTERVAL '1 day 22 hours'),
  ('neet-prime-live', 'aspirant101', '{"0": "A", "1": "A", "2": "A", "3": "A", "179": "C"}', 120, 0, 'connected', TRUE, NOW() - INTERVAL '23 hours');

-- 4. Seed calculated payout standings mapping to leaderboard standings
INSERT INTO contest_payouts (contest_id, username, rank_position, score, aura_points_earned, prize_allocated, payout_status, credited_at)
VALUES
  ('upsc-elite-live', 'aspirant_delhi', 1, 286, 12480, 5400, 'prize_won', NULL),
  ('upsc-elite-live', 'ias_dreamer', 2, 278, 11920, 4200, 'prize_won', NULL),
  ('upsc-elite-live', 'st_stephens_star', 3, 272, 11050, 3600, 'prize_won', NULL),
  ('upsc-elite-live', 'aspirant101', 12, 236, 10920, 2400, 'prize_won', NULL),
  ('upsc-elite-live', 'cutoff_survivor', 60, 198, 8900, 500, 'prize_won', NULL),
  ('upsc-elite-live', 'unlucky_candidate', 61, 196, 8800, 0, 'no_prize', NULL),
  
  ('jee-advanced-live', 'iit_bombay_elite', 1, 342, 12940, 11500, 'prize_credited', NOW() - INTERVAL '1 day'),
  ('jee-advanced-live', 'math_genius', 2, 336, 11840, 9800, 'prize_credited', NOW() - INTERVAL '1 day'),
  ('jee-advanced-live', 'cutoff_jee', 125, 242, 8400, 1000, 'prize_credited', NOW() - INTERVAL '1 day'),
  ('jee-advanced-live', 'aspirant101', 182, 190, 7200, 0, 'no_prize', NULL),

  ('neet-prime-live', 'aspirant101', 1, 720, 13120, 10500, 'prize_credited', NOW() - INTERVAL '6 hours'),
  ('neet-prime-live', 'doctor_hopeful', 2, 712, 12050, 8400, 'prize_credited', NOW() - INTERVAL '6 hours'),
  ('neet-prime-live', 'cutoff_medic', 200, 590, 7400, 300, 'prize_credited', NOW() - INTERVAL '6 hours');
