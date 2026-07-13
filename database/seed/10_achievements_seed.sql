-- Seed data for testing Achievements, Badges, Certificates and Tiers
-- 10_achievements_seed.sql

-- 1. Populate Achievements Catalogue
INSERT INTO achievements (key, category_id, title, description, icon, rarity, aura_reward) VALUES
('first_contest', 'participation', 'First Step', 'Completed your first championship arena contest', '🚀', 'common', 50),
('profile_complete', 'milestones', 'Identity Established', 'Completed your full user profile onboarding credentials', '✨', 'common', 100),
('first_top100', 'ranking', 'Top 100 Challenger', 'Placed in the Top 100 of any national mock tournament', '🏅', 'uncommon', 155),
('first_top10', 'ranking', 'Elite Contender', 'Placed in the Top 10 of any championship league section', '🏆', 'rare', 350),
('national_champion', 'winning', 'National Champion', 'Achieved Rank #1 in a national champion cup replica exam', '👑', 'legendary', 1500),
('perfect_score', 'competition', 'Absolute Precision', 'Scored a perfect maximum score in any subject section', '🧠', 'epic', 500),
('fast_solver', 'consistency', 'Blitzkrieg Master', 'Solved all exam questions in under 50% of allocated time', '⚡', 'uncommon', 100),
('streak_7day', 'consistency', '7-Day Warrior', 'Maintained a active 7-day test submission streak', '🔥', 'uncommon', 200),
('streak_30day', 'consistency', 'Unstoppable Momentum', 'Maintained a active 30-day streak of dynamic quiz completions', '🌟', 'rare', 600),
('aura_legend', 'aura', 'Aura Legend reached', 'Reached Legend player tier by crossing 12,000+ Aura points', '💎', 'epic', 1000),
('competitions_100', 'milestones', 'Century Club member', 'Competed in 100 championship arena events', '🎉', 'legendary', 2500),
('invite_seasonal', 'seasonal', 'Championship Cup 2026', 'Participated in the Winter Season Championships of 2026', '❄️', 'mythic', 1200)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, rarity = EXCLUDED.rarity, aura_reward = EXCLUDED.aura_reward;


-- 2. Populate Badges Catalogue
INSERT INTO badges (key, category_id, title, description, requirements, target_value, icon, rarity, badge_artwork) VALUES
('badge_first_contest', 'participation', 'First Competition', 'Awarded upon joining your first official mock contest', 'Complete 1 contest', 1, '🚀', 'common', '/badges/first_contest.svg'),
('badge_top_100', 'rankings', 'Top 100 Contender', 'Awarded for placing in the national top 100', 'Rank <= 100 in 1 contest', 100, '🏅', 'uncommon', '/badges/top_100.svg'),
('badge_top_10', 'rankings', 'Top 10 Finisher', 'Awarded for placing in the elite top 10', 'Rank <= 10 in 1 contest', 10, '🏆', 'rare', '/badges/top_10.svg'),
('badge_national_champion', 'rankings', 'National Champion', 'Awarded for finishing Rank #1 in any mock exam', 'Rank = 1 in 1 contest', 1, '👑', 'legendary', '/badges/national_champion.svg'),
('badge_perfect_score', 'accuracy', 'Perfect Section Score', 'Awarded for securing 100% marks in a subject area', 'Score 100% in a section', 100, '🧠', 'epic', '/badges/perfect_score.svg'),
('badge_fast_solver', 'accuracy', 'Lightning Solver', 'Awarded for solving an exam with top speed and accuracy', 'Solve in under 50% time', 50, '⚡', 'uncommon', '/badges/fast_solver.svg'),
('badge_consistency_master', 'streaks', 'Consistency Master', 'Awarded for maintaining a 30-day activity streak', 'Streak >= 30 days', 30, '🔥', 'rare', '/badges/consistency_master.svg'),
('badge_aura_legend', 'special', 'Aura Legend', 'Awarded for crossing 12,000+ Aura points', 'Aura >= 12,000 pts', 12000, '💎', 'epic', '/badges/aura_legend.svg'),
('badge_100_competitions', 'participation', 'Century Club Veteran', 'Awarded for completing 100 mock contests', 'Complete 100 contests', 100, '🎉', 'legendary', '/badges/100_competitions.svg'),
('badge_elite_performer', 'special', 'Elite Performer', 'Awarded for top 5% cumulative rankings', 'Top 5% average rank', 5, '🌟', 'mythic', '/badges/elite_performer.svg')
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, requirements = EXCLUDED.requirements, rarity = EXCLUDED.rarity;


-- 3. Loop to Seed Mock Unlocks & Profiles Streaks
DO $$
DECLARE
  r RECORD;
  v_cert_id UUID;
  v_ref_no VARCHAR(100);
  v_ver_id VARCHAR(100);
BEGIN
  FOR r IN SELECT id, username FROM profiles LOOP
    
    -- a. Unlock Initial Badges
    INSERT INTO user_badges (user_id, badge_key) VALUES
    (r.id, 'badge_first_contest'),
    (r.id, 'badge_top_100'),
    (r.id, 'badge_top_10')
    ON CONFLICT DO NOTHING;

    -- b. Unlock initial achievements in user_achievements (linked table) using valid enum values
    INSERT INTO user_achievements (user_id, achievement_key, category, title, description, icon, color, rarity, aura_reward) VALUES
    (r.id, 'first_contest', 'milestone', 'First Step', 'Completed your first championship arena contest', '🚀', 'primary', 'common', 50),
    (r.id, 'profile_complete', 'milestone', 'Identity Established', 'Completed your full user profile onboarding credentials', '✨', 'violet', 'common', 100),
    (r.id, 'first_top100', 'rank', 'Top 100 Challenger', 'Placed in the Top 100 of any national mock tournament', '🏅', 'amber', 'uncommon', 155),
    (r.id, 'first_top10', 'rank', 'Elite Contender', 'Placed in the Top 10 of any championship league section', '🏆', 'violet', 'rare', 350)
    ON CONFLICT (user_id, achievement_key) DO NOTHING;

    -- c. Set mock streaks
    UPDATE streaks
    SET
      current_streak = 5,
      longest_streak = 14,
      last_active_date = CURRENT_DATE,
      weekly_activity_mask = 29, -- binary 011101 active days
      monthly_activity_mask = 1045
    WHERE user_id = r.id;

    -- d. Add a mock certificate (Participation)
    v_ref_no := 'CERT-PART-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-001';
    v_ver_id := 'VERIFY-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-01';
    INSERT INTO user_certificates (
      user_id,
      contest_name,
      exam_category,
      participant_name,
      rank,
      score,
      certificate_type,
      certificate_number,
      verification_id
    )
    VALUES (
      r.id,
      'IIT JEE Advanced Grandmaster Simulator 2026',
      'JEE_ADVANCED',
      COALESCE(r.username, 'Candidate Profile'),
      42,
      276.50,
      'participation',
      v_ref_no,
      v_ver_id
    )
    ON CONFLICT (certificate_number) DO NOTHING
    RETURNING id INTO v_cert_id;

    -- Create certificate verification record
    IF v_cert_id IS NOT NULL THEN
      INSERT INTO certificate_verifications (certificate_id, view_count)
      VALUES (v_cert_id, 3)
      ON CONFLICT DO NOTHING;
    END IF;

    -- e. Add another mock certificate (Winner / National Rank)
    v_ref_no := 'CERT-WIN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-002';
    v_ver_id := 'VERIFY-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-02';
    INSERT INTO user_certificates (
      user_id,
      contest_name,
      exam_category,
      participant_name,
      rank,
      score,
      certificate_type,
      certificate_number,
      verification_id
    )
    VALUES (
      r.id,
      'UPSC Civil Services Prelims Mock Championship',
      'UPSC_CSE',
      COALESCE(r.username, 'Candidate Profile'),
      1,
      182.00,
      'winner',
      v_ref_no,
      v_ver_id
    )
    ON CONFLICT (certificate_number) DO NOTHING
    RETURNING id INTO v_cert_id;

    -- Create certificate verification record
    IF v_cert_id IS NOT NULL THEN
      INSERT INTO certificate_verifications (certificate_id, view_count)
      VALUES (v_cert_id, 12)
      ON CONFLICT DO NOTHING;
    END IF;

  END LOOP;
END $$;
