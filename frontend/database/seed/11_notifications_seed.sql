-- Seed data for testing Notifications & Announcements system
-- 11_notifications_seed.sql

-- 1. Seed Public Announcements
INSERT INTO announcements (category_id, title, content, priority, publish_date) VALUES
(
  'new_categories',
  'Introduction of Medical NEET Speed Blitz Arenas',
  'We are excited to announce the launch of our specialized Medical NEET Speed Blitz categories! Candidates can now practice high-speed biology and physics modules with advanced grading.',
  'normal',
  CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
  'special_events',
  'All India Ranker''s League Championship Cup 2026',
  'Join the largest mock league tournament of the year on August 15, 2026. Stand a chance to earn prestigious digital gold merit credentials and up to ₹1,00,000 in prizes.',
  'high',
  CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
  'maintenance',
  'Scheduled Platform Infrastructure Upgrade Notice',
  'The Ranker''s League portal will undergo standard database indexing upgrades on July 12, 2026, between 02:00 AM and 04:00 AM IST. Live examinations will not be affected.',
  'critical',
  CURRENT_TIMESTAMP - INTERVAL '5 hours'
)
ON CONFLICT DO NOTHING;


-- 2. Loop to Seed User In-App Notifications
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM profiles LOOP
    
    -- a. Prize Credit Notification
    INSERT INTO user_notifications (user_id, type_id, title, description, priority, action_url, action_label, is_read, created_at)
    VALUES (
      r.id,
      'prize_credited',
      'Prize Funds Credited Successfully',
      'Accolade prize of ₹4,500.00 for IIT JEE Advanced Cup has been processed and credited to your Available Balance.',
      'high',
      '/dashboard/wallet',
      'Open Wallet',
      FALSE,
      CURRENT_TIMESTAMP - INTERVAL '1 hour'
    );

    -- b. Certificate Available Notification
    INSERT INTO user_notifications (user_id, type_id, title, description, priority, action_url, action_label, is_read, created_at)
    VALUES (
      r.id,
      'certificate_available',
      'Digital Merit Certificate Available',
      'Your verified placement certificate for UPSC Civil Services Mock Championship is compiled and ready for download.',
      'normal',
      '/dashboard/achievements',
      'View Credentials',
      FALSE,
      CURRENT_TIMESTAMP - INTERVAL '3 hours'
    );

    -- c. Contest Registration Complete
    INSERT INTO user_notifications (user_id, type_id, title, description, priority, action_url, action_label, is_read, created_at)
    VALUES (
      r.id,
      'contest_registration',
      'Registration Confirmed: JEE Advanced Simulator',
      'Your registration fee is settled and seat reservation completed for the upcoming simulator league.',
      'normal',
      '/contests',
      'View Details',
      TRUE,
      CURRENT_TIMESTAMP - INTERVAL '2 days'
    );

    -- d. Aura Level Earned
    INSERT INTO user_notifications (user_id, type_id, title, description, priority, action_url, action_label, is_read, created_at)
    VALUES (
      r.id,
      'aura_earned',
      'Aura Tier Progression: Achiever Rank Reached!',
      'Congratulations! You have crossed the 1,000 Aura points milestone. Your public tier shield is updated to Achiever.',
      'high',
      '/dashboard/achievements',
      'View Aura Hub',
      FALSE,
      CURRENT_TIMESTAMP - INTERVAL '4 days'
    );

    -- e. Platform Security Alert
    INSERT INTO user_notifications (user_id, type_id, title, description, priority, action_url, action_label, is_read, created_at)
    VALUES (
      r.id,
      'security_alert',
      'New Account Session Authorization Detected',
      'A successful login session was established on Chrome browser under Windows OS. Verify if this was you.',
      'critical',
      '/dashboard/settings',
      'Manage Sessions',
      TRUE,
      CURRENT_TIMESTAMP - INTERVAL '5 days'
    );

  END LOOP;
END $$;
