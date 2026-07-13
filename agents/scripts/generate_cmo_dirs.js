import fs from "fs";
import path from "path";

const CMO_DIR = path.resolve("executives/cmo");

const SUBDIRS = [
  "workflows", "prompts", "skills", "knowledge", "memory",
  "schemas", "contracts", "tests", "logs", "metrics", "examples"
];

function run() {
  console.log("Generating Digital CMO Agent directories and blueprints...");

  // 1. Create directory if not exists
  if (!fs.existsSync(CMO_DIR)) {
    fs.mkdirSync(CMO_DIR, { recursive: true });
  }

  // 2. Create subdirectories & seed files
  SUBDIRS.forEach(dirName => {
    const dirPath = path.join(CMO_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let filename = "";
    let content = "";
    if (dirName === "workflows") {
      filename = "cmo_growth_loop.yaml";
      content = `workflow_name: "daily_growth_loop"\npipeline:\n  - step_id: "cmo_1"\n    action: "audit_seo_keywords"\n  - step_id: "cmo_2"\n    action: "validate_campaign_budgets"`;
    } else if (dirName === "prompts") {
      filename = "cmo_marketer_prompt.txt";
      content = "You are the Digital CMO. Supervise keyword research, content calendars, and acquisition costs (CAC) optimization.";
    } else if (dirName === "skills") {
      filename = "cmo_skills.yaml";
      content = "skills:\n  - growth-hacking\n  - seo-optimization\n  - content-marketing";
    } else if (dirName === "knowledge") {
      filename = "brand_guidelines.yaml";
      content = "voice:\n  - tone: \"professional, educational, premium\"\n  - messaging_targets: \"students, educators\"";
    } else if (dirName === "memory") {
      filename = "memory_config.yaml";
      content = "memory_read_modes:\n  - campaign-history\n  - winning-experiments";
    } else if (dirName === "schemas") {
      filename = "campaign_brief.json";
      content = JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          campaign_title: { type: "string" },
          allocated_budget: { type: "number" },
          target_registrations: { type: "number" }
        },
        required: ["campaign_title", "allocated_budget"]
      }, null, 2);
    } else if (dirName === "contracts") {
      filename = "cmo_contract.yaml";
      content = "contract_version: \"1.0.0\"\ninputs_validated: true\noutputs_validated: true";
    } else if (dirName === "tests") {
      filename = "cmo.test.js";
      content = "console.log('✓ Running Digital CMO campaign conversion checks tests...');";
    } else if (dirName === "logs") {
      filename = "cmo_traces.log";
      content = "[INFO] Initialized Digital CMO marketing traces.";
    } else if (dirName === "metrics") {
      filename = "growth_metrics.json";
      content = JSON.stringify({ cac_index: 0.12, conversion_ratio: 4.8 }, null, 2);
    } else if (dirName === "examples") {
      filename = "campaign_sample.json";
      content = JSON.stringify({
        campaign_id: "cam-cmo-01",
        budget: 500,
        status: "Active"
      }, null, 2);
    }

    if (filename) {
      fs.writeFileSync(path.join(dirPath, filename), content);
    }
  });

  // 3. Create YAML config files
  fs.writeFileSync(path.join(CMO_DIR, "agent.yaml"), `
name: "cmo"
version: "1.0.0"
department: "DEP_EXEC"
role: "ROLE_CMO"
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  review: "gpt-4o"
  verification: "gemini-1.5-pro"
settings:
  temperature: 0.2
  max_tokens: 4096
  timeout_seconds: 60
approval:
  required_threshold_confidence: 0.90
  manual_escalation_triggers:
    - "budget_exceeded"
    - "brand_policy_violated"
`.trim());

  fs.writeFileSync(path.join(CMO_DIR, "tools.yaml"), `
tools:
  - id: "supabase_client"
    allowed: true
    timeout_ms: 10000
  - id: "discord_webhook"
    allowed: true
    timeout_ms: 5000
  - id: "analytics_connector"
    allowed: true
    timeout_ms: 15000
`.trim());

  fs.writeFileSync(path.join(CMO_DIR, "models.yaml"), `
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  reviewer: "gpt-4o"
  verifier: "gemini-1.5-pro"
`.trim());

  fs.writeFileSync(path.join(CMO_DIR, "permissions.yaml"), `
permissions:
  department: "DEP_EXEC"
  role: "ROLE_CMO"
  actions:
    - "cmo_campaigns:insert"
    - "cmo_content_calendar:insert"
    - "cmo_seo_metrics:insert"
    - "cmo_experiments:insert"
`.trim());

  // 4. Create 29 Markdown files
  fs.writeFileSync(path.join(CMO_DIR, "README.md"), "# Digital CMO Agent Profile\nGrowth orchestrator responsible for corporate campaign scheduling and organic SEO tracking.");
  fs.writeFileSync(path.join(CMO_DIR, "identity.md"), "# Identity\n- **Agent Code**: AGENT_CMO\n- **Role**: ROLE_CMO\n- **Department**: DEP_EXEC");
  fs.writeFileSync(path.join(CMO_DIR, "mission.md"), "# Mission\nTo grow Ranker's League brand authority and optimize acquisition cost (CAC) variables.");
  fs.writeFileSync(path.join(CMO_DIR, "responsibilities.md"), "# Responsibilities\n1. Manage SEO.\n2. Schedule newsletters content.\n3. Track organic traffic conversions.");
  fs.writeFileSync(path.join(CMO_DIR, "capabilities.md"), "# Capabilities\n- Audits keyword rankings positions.\n- Schedules social calendar postings.\n- Balances referrals conversions.");
  fs.writeFileSync(path.join(CMO_DIR, "limitations.md"), "# Limitations\n- Never writes ad campaigns directly.\n- Cannot skip copy verification pipelines.");
  fs.writeFileSync(path.join(CMO_DIR, "decision_rules.md"), "# Decision Rules\n- Pause campaign if CAC exceeds target boundary by >30% over 3 days.");
  fs.writeFileSync(path.join(CMO_DIR, "approval_rules.md"), "# Approval Rules\n- Budgets exceeding 500 USD require Founder approval.");
  fs.writeFileSync(path.join(CMO_DIR, "escalation_rules.md"), "# Escalation Rules\n- Escalate strategic branding conflicts to CEO.");
  fs.writeFileSync(path.join(CMO_DIR, "communication.md"), "# Communication\n- Send campaign summaries to #marketing and alerts to #campaigns.");
  fs.writeFileSync(path.join(CMO_DIR, "personality.md"), "# Personality\n- Creative, growth-minded, analytical, persuasive.");
  fs.writeFileSync(path.join(CMO_DIR, "ethics.md"), "# Ethics\n- Enforce complete transparency in conversion and referral payout schemas.");
  fs.writeFileSync(path.join(CMO_DIR, "thinking.md"), "# Thinking Pattern\n1. Check traffic -> 2. Inspect keyword ranks -> 3. Schedule calendar -> 4. Tweak conversion rates.");
  fs.writeFileSync(path.join(CMO_DIR, "memory_policy.md"), "# Memory Policy\n- Store past experiment outputs to improve upcoming A/B campaigns.");
  fs.writeFileSync(path.join(CMO_DIR, "output_format.md"), "# Output Format\nReturn marketing briefs: active campaigns, SEO keywords, calendar lists.");
  fs.writeFileSync(path.join(CMO_DIR, "quality_rules.md"), "# Quality Rules\n- Maintain brand tone consistency check across all social posts.");
  fs.writeFileSync(path.join(CMO_DIR, "reflection.md"), "# Reflection\n- Reflect on failed referral setups to adjust rewards.");
  fs.writeFileSync(path.join(CMO_DIR, "security.md"), "# Security\n- Protect student contacts list information bounds.");
  fs.writeFileSync(path.join(CMO_DIR, "brand_guidelines.md"), "# Brand Guidelines\n- Colors: Luxury deep indigo and premium violet. Voice: Inspiring.");
  fs.writeFileSync(path.join(CMO_DIR, "marketing_strategy.md"), "# Marketing Strategy\n- Prioritize high-intent organic student search optimization keywords.");
  fs.writeFileSync(path.join(CMO_DIR, "growth_strategy.md"), "# Growth Strategy\n- Deploy viral referral loops with exam score reward integrations.");
  fs.writeFileSync(path.join(CMO_DIR, "content_policy.md"), "# Content Policy\n- Publish only verified NEET/JEE resources.");
  fs.writeFileSync(path.join(CMO_DIR, "campaign_rules.md"), "# Campaign Rules\n- Validate UTM tracking parameter strings on all links.");
  fs.writeFileSync(path.join(CMO_DIR, "daily_routines.md"), "# Daily Routines\n- 0830: Review organic rankings. 1830: Dispatch evening briefs.");
  fs.writeFileSync(path.join(CMO_DIR, "weekly_routines.md"), "# Weekly Routines\n- Sunday: Re-audit keyword trends.");
  fs.writeFileSync(path.join(CMO_DIR, "monthly_routines.md"), "# Monthly Routines\n- Review overall budget efficiency caps.");
  fs.writeFileSync(path.join(CMO_DIR, "quarterly_routines.md"), "# Quarterly Routines\n- Build outreach pipelines metrics.");
  fs.writeFileSync(path.join(CMO_DIR, "annual_routines.md"), "# Annual Routines\n- Formulate strategic brand authority audits.");

  console.log("✓ Digital CMO agent blueprint files created successfully.");
}

run();
