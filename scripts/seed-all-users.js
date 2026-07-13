import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log("Connecting to Supabase PostgreSQL database to seed user profiles...");
  await client.connect();
  console.log("Connected successfully!");

  // 1. Fetch all user profiles currently in the database
  const res = await client.query("SELECT id, username, full_name FROM profiles");
  console.log(`Found ${res.rows.length} user profile(s) to seed.`);

  for (const row of res.rows) {
    const userId = row.id;
    const username = row.username || `user_${userId.substring(0, 8)}`;
    const fullName = row.full_name || "Aspirant User";

    console.log(`\nSeeding mock ledger, achievements, performance, and wallet records for user: @${username} (${fullName})`);

    // Complete profile details
    await client.query(`
      UPDATE profiles SET
        primary_exam_category = 'JEE_MAIN',
        academic_level = 'class_12',
        target_exam_year = 2027,
        aura_points = COALESCE(NULLIF(aura_points, 0), 2840),
        national_rank = COALESCE(national_rank, 142),
        total_contests_joined = 8,
        profile_status = 'complete'
      WHERE id = $1
    `, [userId]);

    // Seed usernames registry
    await client.query(`
      INSERT INTO usernames (username, user_id) VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
    `, [username, userId]);

    // Seed participant identity
    await client.query(`
      INSERT INTO participant_identity (user_id, participant_id, public_profile_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO NOTHING
    `, [userId, `RL-${userId.substring(0, 8).toUpperCase()}`, `/profile/${username}`]);

    // Seed wallets and wallet balances
    await client.query(`
      INSERT INTO wallets (id) VALUES ($1) ON CONFLICT (id) DO NOTHING
    `, [userId]);

    await client.query(`
      INSERT INTO wallet_balances (
        wallet_id, available_balance, pending_rewards, processing_rewards, contest_entry_balance, lifetime_earnings, lifetime_withdrawals
      )
      VALUES ($1, 7550.00, 0.00, 500.00, 500.00, 10350.00, 2400.00)
      ON CONFLICT (wallet_id) DO UPDATE SET
        available_balance = EXCLUDED.available_balance,
        pending_rewards = EXCLUDED.pending_rewards,
        processing_rewards = EXCLUDED.processing_rewards,
        contest_entry_balance = EXCLUDED.contest_entry_balance,
        lifetime_earnings = EXCLUDED.lifetime_earnings,
        lifetime_withdrawals = EXCLUDED.lifetime_withdrawals
    `, [userId]);

    // Seed Bank and UPI accounts
    await client.query(`
      INSERT INTO bank_accounts (user_id, account_holder, account_number, ifsc, bank_name, branch, is_primary, is_verified)
      VALUES ($1, $2, '•••• •••• •••• 9876', 'HDFC0001242', 'HDFC Bank Ltd', 'Connaught Place, New Delhi', TRUE, TRUE)
      ON CONFLICT DO NOTHING
    `, [userId, fullName]);

    await client.query(`
      INSERT INTO upi_accounts (user_id, upi_id, is_primary, is_verified)
      VALUES ($1, $2, TRUE, TRUE)
      ON CONFLICT DO NOTHING
    `, [userId, `${username.toLowerCase()}@okhdfcbank`]);

    // Seed Transactions history
    await client.query(`
      INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at, completed_at)
      VALUES 
        ($1, 'contest_entry', 'completed', -250.00, $2, 'IIT JEE Advanced Simulator Cup', 'Registration Fee for IIT JEE Simulator Cup', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
        ($1, 'prize_credit', 'completed', 4500.00, $3, 'IIT JEE Advanced Simulator Cup', 'First Class Prize Winnings (Rank #12)', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
        ($1, 'withdrawal', 'processing', -500.00, $4, NULL, 'Withdrawal payout via UPI Account', NOW() - INTERVAL '30 seconds', NULL)
      ON CONFLICT (reference_number) DO NOTHING
    `, [
      userId,
      `TXN-${userId.substring(0, 8).toUpperCase()}-001`,
      `TXN-${userId.substring(0, 8).toUpperCase()}-002`,
      `TXN-${userId.substring(0, 8).toUpperCase()}-003`
    ]);

    // Seed contest registrations for UPSC and JEE
    const upscRegResult = await client.query(`
      INSERT INTO contest_registrations (user_id, contest_id, registration_number, selected_language, status, payment_status, entry_fee_paid)
      VALUES ($1, 'upsc-elite-live', $2, 'English', 'confirmed', 'paid', 499.00)
      ON CONFLICT (user_id, contest_id) DO UPDATE SET status = 'confirmed', payment_status = 'paid'
      RETURNING id
    `, [userId, `REG-UPSC-2026-${userId.substring(0, 8).toUpperCase()}`]);

    if (upscRegResult.rows.length > 0) {
      const regId = upscRegResult.rows[0].id;
      await client.query(`
        INSERT INTO contest_participants (registration_id, seat_number, reporting_time, verification_status)
        VALUES ($1, $2, NOW() + INTERVAL '4 days', 'pending')
        ON CONFLICT DO NOTHING
      `, [regId, `SEAT-UPSC-${userId.substring(0, 4).toUpperCase()}`]);

      await client.query(`
        INSERT INTO contest_payments (registration_id, amount, payment_method, payment_status)
        VALUES ($1, 499.00, 'wallet', 'completed')
        ON CONFLICT DO NOTHING
      `, [regId]);
    }

    const jeeRegResult = await client.query(`
      INSERT INTO contest_registrations (user_id, contest_id, registration_number, selected_language, status, payment_status, entry_fee_paid)
      VALUES ($1, 'jee-advanced-live', $2, 'English', 'confirmed', 'paid', 349.00)
      ON CONFLICT (user_id, contest_id) DO UPDATE SET status = 'confirmed', payment_status = 'paid'
      RETURNING id
    `, [userId, `REG-JEE-2026-${userId.substring(0, 8).toUpperCase()}`]);

    if (jeeRegResult.rows.length > 0) {
      const regId = jeeRegResult.rows[0].id;
      await client.query(`
        INSERT INTO contest_participants (registration_id, seat_number, reporting_time, verification_status)
        VALUES ($1, $2, NOW() + INTERVAL '7 days', 'pending')
        ON CONFLICT DO NOTHING
      `, [regId, `SEAT-JEE-${userId.substring(0, 4).toUpperCase()}`]);

      await client.query(`
        INSERT INTO contest_payments (registration_id, amount, payment_method, payment_status)
        VALUES ($1, 349.00, 'wallet', 'completed')
        ON CONFLICT DO NOTHING
      `, [regId]);
    }

    // Seed trusted device
    await client.query(`
      INSERT INTO trusted_devices (user_id, device_fingerprint, device_name, expires_at)
      VALUES ($1, 'MOCK_FINGERPRINT_123456', 'Chrome on Windows (Trusted)', NOW() + INTERVAL '30 days')
      ON CONFLICT (user_id, device_fingerprint) DO NOTHING
    `, [userId]);

    // Seed user statistics
    await client.query(`
      INSERT INTO user_statistics (
        user_id, total_contests_joined, total_contests_completed, total_contests_won, best_rank, average_score, total_aura_earned, monthly_aura_earned, current_streak, longest_streak, accuracy_percentage
      )
      VALUES ($1, 8, 4, 1, 3, 185.1, 2840, 1450, 6, 9, 74.5)
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
        accuracy_percentage = EXCLUDED.accuracy_percentage
    `, [userId]);

    // Seed aura history
    await client.query(`
      INSERT INTO aura_history (user_id, event_type, points, description, balance_after)
      VALUES 
        ($1, 'welcome_bonus', 50, 'Welcome to Ranker''s League! 🎉', 50),
        ($1, 'profile_complete', 100, 'Completed your profile setup', 150),
        ($1, 'contest_completed', 180, 'Completed JEE Main Sprint #001 — Rank 12', 330),
        ($1, 'contest_completed', 350, 'Completed JEE Main Sprint #002 — Rank 3', 680),
        ($1, 'achievement_unlock', 200, 'Achievement: "Rising Star" unlocked!', 880)
      ON CONFLICT DO NOTHING
    `, [userId]);

    // Seed streaks
    await client.query(`
      INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date)
      VALUES ($1, 6, 9, CURRENT_DATE)
      ON CONFLICT (user_id) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_active_date = EXCLUDED.last_active_date
    `, [userId]);

    // Seed user achievements
    await client.query(`
      INSERT INTO user_achievements (user_id, achievement_key, category, title, description, icon, color, rarity, aura_reward)
      VALUES
        ($1, 'first_contest', 'milestone', 'First Step', 'Joined your first contest', '🚀', 'blue', 'common', 50),
        ($1, 'first_top10', 'rank', 'Top 10 Finisher', 'Finished in the top 10 for the first time', '🏅', 'gold', 'uncommon', 150),
        ($1, 'profile_complete', 'milestone', 'Identity Established', 'Completed your full profile', '✨', 'purple', 'common', 100),
        ($1, 'rising_star', 'badge', 'Rising Star', 'Ranked in top 15 across 3 consecutive contests', '⭐', 'amber', 'rare', 200)
      ON CONFLICT (user_id, achievement_key) DO NOTHING
    `, [userId]);

    // Seed user activity timeline
    await client.query(`
      INSERT INTO user_activity (user_id, event_type, title, description, icon)
      VALUES
        ($1, 'account_created', 'Joined Ranker''s League', 'Your competitive journey begins!', '🚀'),
        ($1, 'achievement_unlocked', 'Achievement Unlocked', 'Identity Established — Profile Complete', '✨'),
        ($1, 'contest_completed', 'Completed JEE Main Sprint #001', 'Final Rank: #12 · Score: 187.5', '🏁')
      ON CONFLICT DO NOTHING
    `, [userId]);

    // Seed user notifications
    await client.query(`
      INSERT INTO user_notifications (user_id, title, description, type_id, is_read)
      VALUES
        ($1, 'Aura Level Up!', 'Congratulations, you have leveled up to Gold Tier!', 'achievement_unlocked', false),
        ($1, 'Refund Credited', '₹250 refund credited to your wallet balance.', 'prize_credited', false)
      ON CONFLICT DO NOTHING
    `, [userId]);

    // Clear previous performance records
    await client.query("DELETE FROM performance_heatmaps WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM performance_reports WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM subject_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM chapter_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM topic_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM difficulty_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM time_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM accuracy_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM consistency_statistics WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM dashboard_summary WHERE user_id = $1", [userId]);

    // 2. Seed performance_heatmaps
    for (let i = 1; i <= 35; i++) {
      const cDate = new Date();
      cDate.setDate(cDate.getDate() - i);
      const difficulty = i % 4 === 0 ? 'very_hard' : i % 3 === 0 ? 'hard' : i % 2 === 0 ? 'medium' : 'easy';

      await client.query(`
        INSERT INTO performance_heatmaps (
          user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        userId, 'Physics', 'Mechanics', 'Kinematics', `Mock Challenge #${i}`,
        Math.floor(Math.random() * 40 + 60), Math.floor(Math.random() * 30 + 70), 15, 3, 2, Math.floor(Math.random() * 40 + 40),
        cDate.toISOString(), Math.floor(Math.random() * 200 + 10), Math.floor(Math.random() * 100 + 50), difficulty
      ]);

      await client.query(`
        INSERT INTO performance_heatmaps (
          user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        userId, 'Chemistry', 'Organic Chemistry', 'Aldehydes & Ketones', `Mock Challenge #${i}`,
        Math.floor(Math.random() * 50 + 45), Math.floor(Math.random() * 40 + 55), 12, 6, 2, Math.floor(Math.random() * 30 + 30),
        cDate.toISOString(), Math.floor(Math.random() * 300 + 20), Math.floor(Math.random() * 80 + 30), difficulty
      ]);

      await client.query(`
        INSERT INTO performance_heatmaps (
          user_id, subject, chapter, topic, contest_name, score, accuracy, correct_answers, incorrect_answers, skipped, average_time_seconds, contest_date, rank, aura_earned, difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        userId, 'Mathematics', 'Calculus', 'Limits & Continuity', `Mock Challenge #${i}`,
        Math.floor(Math.random() * 35 + 65), Math.floor(Math.random() * 25 + 75), 18, 2, 0, Math.floor(Math.random() * 50 + 60),
        cDate.toISOString(), Math.floor(Math.random() * 150 + 5), Math.floor(Math.random() * 150 + 80), difficulty
      ]);
    }

    // 3. Seed subject_statistics
    await client.query(`
      INSERT INTO subject_statistics (user_id, subject, total_contests, average_score, accuracy_rate, rank_average)
      VALUES 
        ($1, 'Physics', 35, 78.4, 82.5, 112.5),
        ($1, 'Chemistry', 35, 68.2, 70.1, 168.4),
        ($1, 'Mathematics', 35, 84.5, 88.0, 78.2),
        ($1, 'Biology', 0, 0, 0, 0),
        ($1, 'Logical Reasoning', 0, 0, 0, 0),
        ($1, 'General Aptitude', 0, 0, 0, 0)
    `, [userId]);

    // 4. Seed chapter_statistics
    await client.query(`
      INSERT INTO chapter_statistics (user_id, subject, chapter, total_questions, correct_questions, accuracy_rate)
      VALUES 
        ($1, 'Physics', 'Mechanics', 150, 120, 80.0),
        ($1, 'Physics', 'Thermodynamics', 80, 60, 75.0),
        ($1, 'Physics', 'Electrostatics', 90, 78, 86.6),
        ($1, 'Chemistry', 'Organic Chemistry', 160, 110, 68.7),
        ($1, 'Chemistry', 'Physical Chemistry', 100, 72, 72.0),
        ($1, 'Mathematics', 'Calculus', 180, 160, 88.8),
        ($1, 'Mathematics', 'Algebra', 120, 102, 85.0)
    `, [userId]);

    // 5. Seed topic_statistics
    await client.query(`
      INSERT INTO topic_statistics (user_id, subject, chapter, topic, total_questions, correct_questions, accuracy_rate)
      VALUES
        ($1, 'Physics', 'Mechanics', 'Kinematics', 50, 42, 84.0),
        ($1, 'Physics', 'Mechanics', 'Newton Laws', 60, 48, 80.0),
        ($1, 'Physics', 'Mechanics', 'Rotational Mechanics', 40, 30, 75.0),
        ($1, 'Chemistry', 'Organic Chemistry', 'Aldehydes & Ketones', 60, 40, 66.6),
        ($1, 'Chemistry', 'Organic Chemistry', 'Amines & Amides', 50, 32, 64.0),
        ($1, 'Mathematics', 'Calculus', 'Limits & Continuity', 60, 56, 93.3),
        ($1, 'Mathematics', 'Calculus', 'Integration', 70, 60, 85.7),
        ($1, 'Mathematics', 'Calculus', 'Differential Equations', 50, 44, 88.0)
    `, [userId]);

    // 6. Seed difficulty_statistics
    await client.query(`
      INSERT INTO difficulty_statistics (user_id, difficulty_level, total_questions, correct_questions, accuracy_rate)
      VALUES
        ($1, 'easy', 200, 192, 96.0),
        ($1, 'medium', 350, 310, 88.5),
        ($1, 'hard', 180, 126, 70.0),
        ($1, 'very_hard', 120, 52, 43.3)
    `, [userId]);

    // 7. Seed time_statistics
    await client.query(`
      INSERT INTO time_statistics (user_id, subject, chapter, average_solve_time_seconds, pace)
      VALUES
        ($1, 'Physics', 'Mechanics', 45, 'normal'),
        ($1, 'Physics', 'Thermodynamics', 52, 'slow'),
        ($1, 'Physics', 'Electrostatics', 38, 'fast'),
        ($1, 'Chemistry', 'Organic Chemistry', 25, 'fast'),
        ($1, 'Chemistry', 'Physical Chemistry', 48, 'normal'),
        ($1, 'Mathematics', 'Calculus', 65, 'very_slow'),
        ($1, 'Mathematics', 'Algebra', 50, 'slow')
    `, [userId]);

    // 8. Seed accuracy_statistics
    await client.query(`
      INSERT INTO accuracy_statistics (user_id, subject, accuracy_rate, accuracy_rate_trend)
      VALUES
        ($1, 'Physics', 82.5, '[{"date":"2026-06-01", "accuracy": 76}, {"date":"2026-06-15", "accuracy": 80}, {"date":"2026-07-01", "accuracy": 82.5}]'::JSONB),
        ($1, 'Chemistry', 70.1, '[{"date":"2026-06-01", "accuracy": 65}, {"date":"2026-06-15", "accuracy": 68}, {"date":"2026-07-01", "accuracy": 70.1}]'::JSONB),
        ($1, 'Mathematics', 88.0, '[{"date":"2026-06-01", "accuracy": 84}, {"date":"2026-06-15", "accuracy": 86}, {"date":"2026-07-01", "accuracy": 88.0}]'::JSONB)
    `, [userId]);

    // 9. Seed consistency_statistics
    for (let d = 0; d < 120; d++) {
      if (Math.random() > 0.65) {
        const streakDate = new Date();
        streakDate.setDate(streakDate.getDate() - d);
        await client.query(`
          INSERT INTO consistency_statistics (user_id, date, contests_completed)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, date) DO NOTHING
        `, [userId, streakDate.toISOString().split("T")[0], Math.floor(Math.random() * 3 + 1)]);
      }
    }

    // 10. Seed dashboard_summary
    await client.query(`
      INSERT INTO dashboard_summary (user_id, total_aura, global_rank, current_streak, next_tier_progress)
      VALUES ($1, 2840, 142, 8, 73.5)
      ON CONFLICT (user_id) DO UPDATE SET
        total_aura = EXCLUDED.total_aura,
        global_rank = EXCLUDED.global_rank,
        current_streak = EXCLUDED.current_streak,
        next_tier_progress = EXCLUDED.next_tier_progress
    `, [userId]);

    // 11. Seed performance_reports
    await client.query(`
      INSERT INTO performance_reports (
        user_id, overall_summary, strongest_subject, weakest_subject, strongest_chapter, weakest_chapter, strongest_topic, weakest_topic, most_improved_subject, needs_immediate_attention, average_accuracy, average_contest_rank, average_aura, contest_consistency, smart_insights, improvement_opportunities
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      userId,
      'Your overall competitive performance is excellent, particularly in Mathematics. You exhibit superior logical reasoning and step-by-step calculus skills. However, organic chemistry reaction pathways require structured revision to optimize your composite rank.',
      'Mathematics', 'Chemistry', 'Calculus', 'Organic Chemistry', 'Limits & Continuity', 'Amines & Amides', 'Physics', 'Aldehydes & Ketones',
      80.2, 119.7, 86.6,
      JSON.stringify({ weekly_average: 4.5, monthly_completions: 18 }),
      JSON.stringify([
        "Your Mathematics performance is outstanding, averaging 88% accuracy.",
        "Organic Chemistry remains your weakest chapter with a 64% accuracy rate.",
        "Calculus is consistently your strongest subject area, maintaining a 93% accuracy trend.",
        "You lose the most marks in Very Hard Difficulty questions, where accuracy drops to 43%.",
        "Your average solving speed has improved by 12% over the last 15 days."
      ]),
      JSON.stringify([
        { description: "If you answered 3 more questions correctly in Chemistry, your average rank would improve by 54 positions.", impact: "Rank improves by 54 positions" },
        { description: "If your accuracy improves by 4%, you are projected to enter the National Top 100.", impact: "Top 100 projected entrance" }
      ])
    ]);
  }

  // Force PostgREST reload
  try {
    console.log("\nReloading PostgREST Schema Cache...");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("✅ PostgREST schema cache reloaded!");
  } catch (err) {
    console.warn("⚠️ Failed to reload schema cache:", err.message);
  }

  await client.end();
  console.log("\nDatabase seeding completed successfully for all users!");
}

run().catch(err => {
  console.error("Fatal Error running migrations:", err);
  process.exit(1);
});
