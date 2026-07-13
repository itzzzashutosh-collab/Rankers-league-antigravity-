-- ================================================================
-- Performance Analytics Seed Data — 08_performance_seed.sql
-- ================================================================

DO $$
DECLARE
  demo_user_id UUID;
  now_ts TIMESTAMP WITH TIME ZONE := NOW();
  c_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the first user in auth.users
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'No users found. Create a user via auth first, then re-run this seed.';
    RETURN;
  END IF;

  -- Clear previous analytics records for clean overwrite
  DELETE FROM performance_heatmaps WHERE user_id = demo_user_id;
  DELETE FROM performance_reports WHERE user_id = demo_user_id;
  DELETE FROM subject_statistics WHERE user_id = demo_user_id;
  DELETE FROM chapter_statistics WHERE user_id = demo_user_id;
  DELETE FROM topic_statistics WHERE user_id = demo_user_id;
  DELETE FROM difficulty_statistics WHERE user_id = demo_user_id;
  DELETE FROM time_statistics WHERE user_id = demo_user_id;
  DELETE FROM accuracy_statistics WHERE user_id = demo_user_id;
  DELETE FROM consistency_statistics WHERE user_id = demo_user_id;
  DELETE FROM dashboard_summary WHERE user_id = demo_user_id;

  -- ============================================================
  -- 1. Seed performance_heatmaps (past mock exam cells)
  -- ============================================================
  FOR i IN 1..35 LOOP
    c_date := now_ts - (i * INTERVAL '1 day') - (random() * INTERVAL '12 hours');
    
    -- Subject: Physics
    INSERT INTO performance_heatmaps (
      user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
    ) VALUES (
      demo_user_id, 'Physics', 'Mechanics', 'Kinematics', 'Mock Challenge #' || i, 
      floor(random() * 40 + 60), floor(random() * 30 + 70), 15, 3, 2, floor(random() * 40 + 40), 
      c_date, floor(random() * 200 + 10), floor(random() * 100 + 50), 
      CASE WHEN i % 4 = 0 THEN 'very_hard' WHEN i % 3 = 0 THEN 'hard' WHEN i % 2 = 0 THEN 'medium' ELSE 'easy' END::VARCHAR
    );

    -- Subject: Chemistry
    INSERT INTO performance_heatmaps (
      user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
    ) VALUES (
      demo_user_id, 'Chemistry', 'Organic Chemistry', 'Aldehydes & Ketones', 'Mock Challenge #' || i, 
      floor(random() * 50 + 45), floor(random() * 40 + 55), 12, 6, 2, floor(random() * 30 + 30), 
      c_date, floor(random() * 300 + 20), floor(random() * 80 + 30),
      CASE WHEN i % 4 = 0 THEN 'very_hard' WHEN i % 3 = 0 THEN 'hard' WHEN i % 2 = 0 THEN 'medium' ELSE 'easy' END::VARCHAR
    );

    -- Subject: Mathematics
    INSERT INTO performance_heatmaps (
      user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
    ) VALUES (
      demo_user_id, 'Mathematics', 'Calculus', 'Limits & Continuity', 'Mock Challenge #' || i, 
      floor(random() * 35 + 65), floor(random() * 25 + 75), 18, 2, 0, floor(random() * 50 + 60), 
      c_date, floor(random() * 150 + 5), floor(random() * 150 + 80),
      CASE WHEN i % 4 = 0 THEN 'very_hard' WHEN i % 3 = 0 THEN 'hard' WHEN i % 2 = 0 THEN 'medium' ELSE 'easy' END::VARCHAR
    );
  END LOOP;

  -- ============================================================
  -- 2. Seed subject_statistics
  -- ============================================================
  INSERT INTO subject_statistics (user_id, subject, total_contests, average_score, accuracy_rate, rank_average)
  VALUES 
    (demo_user_id, 'Physics', 35, 78.4, 82.5, 112.5),
    (demo_user_id, 'Chemistry', 35, 68.2, 70.1, 168.4),
    (demo_user_id, 'Mathematics', 35, 84.5, 88.0, 78.2),
    (demo_user_id, 'Biology', 0, 0, 0, 0),
    (demo_user_id, 'Logical Reasoning', 0, 0, 0, 0),
    (demo_user_id, 'General Aptitude', 0, 0, 0, 0);

  -- ============================================================
  -- 3. Seed chapter_statistics
  -- ============================================================
  INSERT INTO chapter_statistics (user_id, subject, chapter, total_questions, correct_questions, accuracy_rate)
  VALUES 
    (demo_user_id, 'Physics', 'Mechanics', 150, 120, 80.0),
    (demo_user_id, 'Physics', 'Thermodynamics', 80, 60, 75.0),
    (demo_user_id, 'Physics', 'Electrostatics', 90, 78, 86.6),
    (demo_user_id, 'Chemistry', 'Organic Chemistry', 160, 110, 68.7),
    (demo_user_id, 'Chemistry', 'Physical Chemistry', 100, 72, 72.0),
    (demo_user_id, 'Mathematics', 'Calculus', 180, 160, 88.8),
    (demo_user_id, 'Mathematics', 'Algebra', 120, 102, 85.0);

  -- ============================================================
  -- 4. Seed topic_statistics
  -- ============================================================
  INSERT INTO topic_statistics (user_id, subject, chapter, topic, total_questions, correct_questions, accuracy_rate)
  VALUES
    (demo_user_id, 'Physics', 'Mechanics', 'Kinematics', 50, 42, 84.0),
    (demo_user_id, 'Physics', 'Mechanics', 'Newton Laws', 60, 48, 80.0),
    (demo_user_id, 'Physics', 'Mechanics', 'Rotational Mechanics', 40, 30, 75.0),
    (demo_user_id, 'Chemistry', 'Organic Chemistry', 'Aldehydes & Ketones', 60, 40, 66.6),
    (demo_user_id, 'Chemistry', 'Organic Chemistry', 'Amines & Amides', 50, 32, 64.0),
    (demo_user_id, 'Mathematics', 'Calculus', 'Limits & Continuity', 60, 56, 93.3),
    (demo_user_id, 'Mathematics', 'Calculus', 'Integration', 70, 60, 85.7),
    (demo_user_id, 'Mathematics', 'Calculus', 'Differential Equations', 50, 44, 88.0);

  -- ============================================================
  -- 5. Seed difficulty_statistics
  -- ============================================================
  INSERT INTO difficulty_statistics (user_id, difficulty_level, total_questions, correct_questions, accuracy_rate)
  VALUES
    (demo_user_id, 'easy', 200, 192, 96.0),
    (demo_user_id, 'medium', 350, 310, 88.5),
    (demo_user_id, 'hard', 180, 126, 70.0),
    (demo_user_id, 'very_hard', 120, 52, 43.3);

  -- ============================================================
  -- 6. Seed time_statistics
  -- ============================================================
  INSERT INTO time_statistics (user_id, subject, chapter, average_solve_time_seconds, pace)
  VALUES
    (demo_user_id, 'Physics', 'Mechanics', 45, 'normal'),
    (demo_user_id, 'Physics', 'Thermodynamics', 52, 'slow'),
    (demo_user_id, 'Physics', 'Electrostatics', 38, 'fast'),
    (demo_user_id, 'Chemistry', 'Organic Chemistry', 25, 'fast'),
    (demo_user_id, 'Chemistry', 'Physical Chemistry', 48, 'normal'),
    (demo_user_id, 'Mathematics', 'Calculus', 65, 'very_slow'),
    (demo_user_id, 'Mathematics', 'Algebra', 50, 'slow');

  -- ============================================================
  -- 7. Seed accuracy_statistics
  -- ============================================================
  INSERT INTO accuracy_statistics (user_id, subject, accuracy_rate, accuracy_rate_trend)
  VALUES
    (demo_user_id, 'Physics', 82.5, '[{"date":"2026-06-01", "accuracy": 76}, {"date":"2026-06-15", "accuracy": 80}, {"date":"2026-07-01", "accuracy": 82.5}]'::JSONB),
    (demo_user_id, 'Chemistry', 70.1, '[{"date":"2026-06-01", "accuracy": 65}, {"date":"2026-06-15", "accuracy": 68}, {"date":"2026-07-01", "accuracy": 70.1}]'::JSONB),
    (demo_user_id, 'Mathematics', 88.0, '[{"date":"2026-06-01", "accuracy": 84}, {"date":"2026-06-15", "accuracy": 86}, {"date":"2026-07-01", "accuracy": 88.0}]'::JSONB);

  -- ============================================================
  -- 8. Seed consistency_statistics (daily GitHub style nodes)
  -- ============================================================
  FOR i IN 0..120 LOOP
    -- Randomly seed daily contest completions over 120 days
    IF random() > 0.65 THEN
      INSERT INTO consistency_statistics (user_id, date, contests_completed)
      VALUES (demo_user_id, (now_ts - (i * INTERVAL '1 day'))::DATE, floor(random() * 3 + 1))
      ON CONFLICT (user_id, date) DO UPDATE 
      SET contests_completed = consistency_statistics.contests_completed + 1;
    END IF;
  END LOOP;

  -- ============================================================
  -- 9. Seed dashboard_summary
  -- ============================================================
  INSERT INTO dashboard_summary (user_id, total_aura, global_rank, current_streak, next_tier_progress)
  VALUES (demo_user_id, 2840, 142, 8, 73.5)
  ON CONFLICT (user_id) DO UPDATE
  SET total_aura = EXCLUDED.total_aura,
      global_rank = EXCLUDED.global_rank,
      current_streak = EXCLUDED.current_streak,
      next_tier_progress = EXCLUDED.next_tier_progress;

  -- ============================================================
  -- 10. Seed performance_reports (AI Summary details)
  -- ============================================================
  INSERT INTO performance_reports (
    user_id, overall_summary, strongest_subject, weakest_subject, strongest_chapter, weakest_chapter, strongest_topic, weakest_topic, most_improved_subject, needs_immediate_attention, average_accuracy, average_contest_rank, average_aura, contest_consistency, smart_insights, improvement_opportunities
  ) VALUES (
    demo_user_id,
    'Your overall competitive performance is excellent, particularly in Mathematics. You exhibit superior logical reasoning and step-by-step calculus skills. However, organic chemistry reaction pathways require structured revision to optimize your composite rank.',
    'Mathematics', 'Chemistry', 'Calculus', 'Organic Chemistry', 'Limits & Continuity', 'Amines & Amides', 'Physics', 'Aldehydes & Ketones',
    80.2, 119.7, 86.6,
    '{"weekly_average": 4.5, "monthly_completions": 18}'::JSONB,
    '[
      "Your Mathematics performance is outstanding, averaging 88% accuracy.",
      "Organic Chemistry remains your weakest chapter with a 64% accuracy rate.",
      "Calculus is consistently your strongest subject area, maintaining a 93% accuracy trend.",
      "You lose the most marks in Very Hard Difficulty questions, where accuracy drops to 43%.",
      "Your average solving speed has improved by 12% over the last 15 days."
    ]'::JSONB,
    '[
      {"description": "If you answered 3 more questions correctly in Chemistry, your average rank would improve by 54 positions.", "impact": "Rank improves by 54 positions"},
      {"description": "If your accuracy improves by 4%, you are projected to enter the National Top 100.", "impact": "Top 100 projected entrance"}
    ]'::JSONB
  );

END $$;
