-- ================================================================
-- Dashboard Seed Data — 06_dashboard_seed.sql
-- Run AFTER creating a test user via Supabase Auth
-- Replace the UUIDs below with your actual test user ID
-- ================================================================

-- NOTE: This seed script uses a placeholder UUID.
-- Replace 'YOUR_TEST_USER_ID' with an actual auth.users id from your Supabase project.
-- You can find it in Authentication > Users in your Supabase dashboard.

DO $$
DECLARE
  demo_user_id UUID;
  now_ts TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
  -- Get the first user in auth.users for demo purposes
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'No users found. Create a user via auth first, then re-run this seed.';
    RETURN;
  END IF;

  -- ============================================================
  -- Profile update (make demo user look good)
  -- ============================================================
  UPDATE profiles SET
    full_name = 'Aryan Sharma',
    username = 'aryan_jee',
    primary_exam_category = 'JEE_MAIN',
    academic_level = 'class_12',
    target_exam_year = 2027,
    avatar_url = NULL,
    aura_points = 2840,
    national_rank = 142,
    total_contests_joined = 8,
    profile_status = 'complete'
  WHERE id = demo_user_id;

  -- ============================================================
  -- Usernames registry
  -- ============================================================
  INSERT INTO usernames (username, user_id) VALUES ('aryan_jee', demo_user_id)
  ON CONFLICT (username) DO NOTHING;

  -- Participant identity
  INSERT INTO participant_identity (user_id, participant_id, public_profile_url)
  VALUES (demo_user_id, 'RL-20260001', '/profile/aryan_jee')
  ON CONFLICT (user_id) DO NOTHING;

  -- ============================================================
  -- Contest Enrollments
  -- ============================================================
  INSERT INTO contest_enrollments
    (user_id, contest_slug, contest_name, exam_category, contest_date, status, final_rank, final_score, aura_earned, prize_won)
  VALUES
    -- Completed contests
    (demo_user_id, 'jee-main-sprint-001', 'JEE Main Sprint #001', 'JEE_MAIN',
     now_ts - INTERVAL '14 days', 'completed', 12, 187.5, 350, 0),
    (demo_user_id, 'jee-main-sprint-002', 'JEE Main Sprint #002', 'JEE_MAIN',
     now_ts - INTERVAL '7 days', 'completed', 3, 215.0, 520, 500),
    (demo_user_id, 'neet-mock-elite-001', 'NEET Mock Elite #001', 'NEET_UG',
     now_ts - INTERVAL '5 days', 'completed', 28, 540.0, 180, 0),
    (demo_user_id, 'jee-advanced-prep-01', 'JEE Advanced Prep Battle', 'JEE_ADVANCED',
     now_ts - INTERVAL '3 days', 'completed', 7, 198.0, 400, 200),
    -- Upcoming contest
    (demo_user_id, 'jee-main-sprint-003', 'JEE Main Sprint #003', 'JEE_MAIN',
     now_ts + INTERVAL '2 days', 'registered', NULL, NULL, 0, 0),
    (demo_user_id, 'cat-mock-series-01', 'CAT Mock Series #01', 'CAT',
     now_ts + INTERVAL '5 days', 'registered', NULL, NULL, 0, 0),
    -- Live contest (simulated)
    (demo_user_id, 'jee-main-live-now', 'JEE Main Mega Live Contest', 'JEE_MAIN',
     now_ts - INTERVAL '30 minutes', 'live', NULL, NULL, 0, 0),
    -- Cancelled
    (demo_user_id, 'gate-mock-series-01', 'GATE Mock Series #01', 'GATE',
     now_ts - INTERVAL '1 day', 'cancelled', NULL, NULL, 0, 0);

  -- ============================================================
  -- User Statistics
  -- ============================================================
  INSERT INTO user_statistics
    (user_id, total_contests_joined, total_contests_completed, total_contests_won,
     best_rank, average_score, total_aura_earned, monthly_aura_earned,
     current_streak, longest_streak, accuracy_percentage)
  VALUES
    (demo_user_id, 8, 4, 1, 3, 185.1, 2840, 1450, 6, 9, 74.5)
  ON CONFLICT (user_id) DO UPDATE SET
    total_contests_joined = EXCLUDED.total_contests_joined,
    total_contests_completed = EXCLUDED.total_contests_completed,
    total_contests_won = EXCLUDED.total_contests_won,
    best_rank = EXCLUDED.best_rank,
    average_score = EXCLUDED.average_score,
    total_aura_earned = EXCLUDED.total_aura_earned,
    monthly_aura_earned = EXCLUDED.monthly_aura_earned,
    current_streak = EXCLUDED.current_streak,
    longest_streak = EXCLUDED.longest_streak,
    accuracy_percentage = EXCLUDED.accuracy_percentage;

  -- ============================================================
  -- Aura History
  -- ============================================================
  INSERT INTO aura_history (user_id, event_type, points, description, contest_name, balance_after, created_at) VALUES
    (demo_user_id, 'welcome_bonus', 50, 'Welcome to Ranker''s League! 🎉', NULL, 50, now_ts - INTERVAL '21 days'),
    (demo_user_id, 'profile_complete', 100, 'Completed your profile setup', NULL, 150, now_ts - INTERVAL '21 days'),
    (demo_user_id, 'contest_join', 20, 'Joined JEE Main Sprint #001', 'JEE Main Sprint #001', 170, now_ts - INTERVAL '15 days'),
    (demo_user_id, 'contest_completed', 180, 'Completed JEE Main Sprint #001 — Rank 12', 'JEE Main Sprint #001', 350, now_ts - INTERVAL '14 days'),
    (demo_user_id, 'contest_join', 20, 'Joined JEE Main Sprint #002', 'JEE Main Sprint #002', 370, now_ts - INTERVAL '8 days'),
    (demo_user_id, 'rank_top10', 150, 'Top 10 finish! Rank 3 in JEE Main Sprint #002', 'JEE Main Sprint #002', 520, now_ts - INTERVAL '7 days'),
    (demo_user_id, 'contest_completed', 350, 'Completed JEE Main Sprint #002 — Rank 3', 'JEE Main Sprint #002', 870, now_ts - INTERVAL '7 days'),
    (demo_user_id, 'streak_bonus', 100, '7-day contest streak bonus! 🔥', NULL, 970, now_ts - INTERVAL '7 days'),
    (demo_user_id, 'contest_join', 20, 'Joined NEET Mock Elite #001', 'NEET Mock Elite #001', 990, now_ts - INTERVAL '6 days'),
    (demo_user_id, 'contest_completed', 160, 'Completed NEET Mock Elite #001 — Rank 28', 'NEET Mock Elite #001', 1150, now_ts - INTERVAL '5 days'),
    (demo_user_id, 'achievement_unlock', 200, 'Achievement: "Rising Star" unlocked!', NULL, 1350, now_ts - INTERVAL '5 days'),
    (demo_user_id, 'contest_join', 20, 'Joined JEE Advanced Prep Battle', 'JEE Advanced Prep Battle', 1370, now_ts - INTERVAL '4 days'),
    (demo_user_id, 'rank_top10', 150, 'Top 10 finish! Rank 7 in JEE Advanced Prep', 'JEE Advanced Prep Battle', 1520, now_ts - INTERVAL '3 days'),
    (demo_user_id, 'contest_completed', 300, 'Completed JEE Advanced Prep Battle — Rank 7', 'JEE Advanced Prep Battle', 1820, now_ts - INTERVAL '3 days'),
    (demo_user_id, 'achievement_unlock', 500, 'Achievement: "Consistent Performer" unlocked!', NULL, 2320, now_ts - INTERVAL '2 days'),
    (demo_user_id, 'streak_bonus', 200, '14-day contest streak bonus! 🔥🔥', NULL, 2520, now_ts - INTERVAL '1 day'),
    (demo_user_id, 'achievement_unlock', 320, 'Achievement: "Gold Tier Achiever" unlocked!', NULL, 2840, now_ts);

  -- ============================================================
  -- Achievements
  -- ============================================================
  INSERT INTO user_achievements
    (user_id, achievement_key, category, title, description, icon, color, rarity, aura_reward, earned_at)
  VALUES
    (demo_user_id, 'first_contest', 'milestone', 'First Step', 'Joined your first contest', '🚀', 'blue', 'common', 50, now_ts - INTERVAL '14 days'),
    (demo_user_id, 'first_top10', 'rank', 'Top 10 Finisher', 'Finished in the top 10 for the first time', '🏅', 'gold', 'uncommon', 150, now_ts - INTERVAL '7 days'),
    (demo_user_id, 'profile_complete', 'milestone', 'Identity Established', 'Completed your full profile', '✨', 'purple', 'common', 100, now_ts - INTERVAL '21 days'),
    (demo_user_id, 'rising_star', 'badge', 'Rising Star', 'Ranked in top 15 across 3 consecutive contests', '⭐', 'amber', 'rare', 200, now_ts - INTERVAL '5 days'),
    (demo_user_id, 'consistent_performer', 'badge', 'Consistent Performer', 'Completed 4+ contests with above-average scores', '🎯', 'emerald', 'rare', 500, now_ts - INTERVAL '2 days'),
    (demo_user_id, 'gold_tier', 'aura', 'Gold Tier Achiever', 'Reached Gold tier with 2500+ Aura Points', '🥇', 'gold', 'epic', 320, now_ts),
    (demo_user_id, '7_day_streak', 'streak', '7-Day Warrior', 'Maintained a 7-day contest streak', '🔥', 'red', 'uncommon', 100, now_ts - INTERVAL '7 days')
  ON CONFLICT (user_id, achievement_key) DO NOTHING;

  -- ============================================================
  -- Activity Timeline
  -- ============================================================
  INSERT INTO user_activity (user_id, event_type, title, description, icon, created_at) VALUES
    (demo_user_id, 'account_created', 'Joined Ranker''s League', 'Your competitive journey begins!', '🚀', now_ts - INTERVAL '21 days'),
    (demo_user_id, 'achievement_unlocked', 'Achievement Unlocked', 'Identity Established — Profile Complete', '✨', now_ts - INTERVAL '21 days'),
    (demo_user_id, 'contest_joined', 'Joined JEE Main Sprint #001', 'Contest scheduled for tomorrow', '📝', now_ts - INTERVAL '15 days'),
    (demo_user_id, 'contest_completed', 'Completed JEE Main Sprint #001', 'Final Rank: #12 · Score: 187.5', '🏁', now_ts - INTERVAL '14 days'),
    (demo_user_id, 'aura_earned', 'Earned 350 Aura Points', 'Contest completion reward', '⚡', now_ts - INTERVAL '14 days'),
    (demo_user_id, 'contest_joined', 'Joined JEE Main Sprint #002', 'Ready to compete again!', '📝', now_ts - INTERVAL '8 days'),
    (demo_user_id, 'contest_completed', 'Completed JEE Main Sprint #002', 'Final Rank: #3 · Score: 215.0', '🏁', now_ts - INTERVAL '7 days'),
    (demo_user_id, 'aura_earned', 'Earned 520 Aura Points', 'Top 3 finish + streak bonus', '⚡', now_ts - INTERVAL '7 days'),
    (demo_user_id, 'achievement_unlocked', 'Achievement Unlocked', 'Rising Star — Top 15 in 3 contests', '⭐', now_ts - INTERVAL '5 days'),
    (demo_user_id, 'result_published', 'Result Published', 'JEE Main Sprint #002 — Official Result Available', '📊', now_ts - INTERVAL '5 days'),
    (demo_user_id, 'rank_achieved', 'National Rank Updated', 'Your rank improved to #142 nationally!', '📈', now_ts - INTERVAL '4 days'),
    (demo_user_id, 'contest_joined', 'Joined JEE Advanced Prep Battle', 'Taking on a new challenge', '⚔️', now_ts - INTERVAL '4 days'),
    (demo_user_id, 'contest_completed', 'Completed JEE Advanced Prep Battle', 'Final Rank: #7 · Score: 198.0', '🏁', now_ts - INTERVAL '3 days'),
    (demo_user_id, 'achievement_unlocked', 'Achievement Unlocked', 'Consistent Performer badge earned!', '🎯', now_ts - INTERVAL '2 days'),
    (demo_user_id, 'achievement_unlocked', 'Achievement Unlocked', 'Gold Tier Achiever — 2500+ Aura', '🥇', now_ts - INTERVAL '1 hour');

END $$;
