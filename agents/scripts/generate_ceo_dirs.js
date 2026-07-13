import fs from "fs";
import path from "path";

const CEO_DIR = path.resolve("executives/ceo");

const SUBDIRS = [
  "workflows", "prompts", "skills", "knowledge", "memory",
  "schemas", "contracts", "tests", "logs", "metrics", "examples"
];

function run() {
  console.log("Generating Digital CEO Agent directories and blueprints...");

  // 1. Create directory if not exists
  if (!fs.existsSync(CEO_DIR)) {
    fs.mkdirSync(CEO_DIR, { recursive: true });
  }

  // 2. Create subdirectories & seed files
  SUBDIRS.forEach(dirName => {
    const dirPath = path.join(CEO_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let filename = "";
    let content = "";
    if (dirName === "workflows") {
      filename = "ceo_strategy_loop.yaml";
      content = `workflow_name: "daily_governance_loop"\npipeline:\n  - step_id: "ceo_1"\n    action: "analyze_health"\n  - step_id: "ceo_2"\n    action: "allocate_budgets"`;
    } else if (dirName === "prompts") {
      filename = "ceo_briefing_prompt.txt";
      content = "You are the Digital CEO. Direct the department executives, prioritize tasks, and keep the Founder updated with briefings.";
    } else if (dirName === "skills") {
      filename = "ceo_skills.yaml";
      content = "skills:\n  - strategic-planning\n  - delegation\n  - cost-monitoring";
    } else if (dirName === "knowledge") {
      filename = "company_handbook.yaml";
      content = "rules:\n  - dynamic-budgets-caps\n  - security-escalation-protocols\n  - payout-thresholds";
    } else if (dirName === "memory") {
      filename = "memory_config.yaml";
      content = "memory_read_modes:\n  - founder-preferences\n  - history-decisions";
    } else if (dirName === "schemas") {
      filename = "morning_brief.json";
      content = JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          objectives: { type: "array" },
          revenue_yesterday: { type: "number" },
          ai_cost_yesterday: { type: "number" }
        },
        required: ["objectives", "revenue_yesterday"]
      }, null, 2);
    } else if (dirName === "contracts") {
      filename = "ceo_contract.yaml";
      content = "contract_version: \"1.0.0\"\ninputs_validated: true\noutputs_validated: true";
    } else if (dirName === "tests") {
      filename = "ceo.test.js";
      content = "console.log('✓ Running Digital CEO leadership checks tests...');";
    } else if (dirName === "logs") {
      filename = "ceo_traces.log";
      content = "[INFO] Initialized Digital CEO executive traces.";
    } else if (dirName === "metrics") {
      filename = "health_metrics.json";
      content = JSON.stringify({ health_score: 96.5, pending_approvals: 2 }, null, 2);
    } else if (dirName === "examples") {
      filename = "morning_brief_sample.json";
      content = JSON.stringify({
        report_id: "rep-ceo-01",
        objectives: ["Launch NEET Promo", "Audit UPSC evaluators"],
        revenue_yesterday: 45000
      }, null, 2);
    }

    if (filename) {
      fs.writeFileSync(path.join(dirPath, filename), content);
    }
  });

  // 3. Create YAML config files
  fs.writeFileSync(path.join(CEO_DIR, "agent.yaml"), `
name: "ceo"
version: "1.0.0"
department: "DEP_EXEC"
role: "ROLE_CEO"
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  review: "gpt-4o"
  verification: "gemini-1.5-pro"
settings:
  temperature: 0.1
  max_tokens: 4096
  timeout_seconds: 60
approval:
  required_threshold_confidence: 0.90
  manual_escalation_triggers:
    - "db_migration_required"
    - "prize_matrix_modification"
`.trim());

  fs.writeFileSync(path.join(CEO_DIR, "tools.yaml"), `
tools:
  - id: "supabase_client"
    allowed: true
    timeout_ms: 10000
  - id: "discord_webhook"
    allowed: true
    timeout_ms: 5000
  - id: "reporting_engine"
    allowed: true
    timeout_ms: 15000
`.trim());

  fs.writeFileSync(path.join(CEO_DIR, "models.yaml"), `
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  reviewer: "gpt-4o"
  verifier: "gemini-1.5-pro"
`.trim());

  fs.writeFileSync(path.join(CEO_DIR, "permissions.yaml"), `
permissions:
  department: "DEP_EXEC"
  role: "ROLE_CEO"
  actions:
    - "ceo_decisions:insert"
    - "ceo_reports:insert"
    - "ceo_priorities:update"
    - "ceo_approval_queue:update"
`.trim());

  // 4. Create 25 Markdown files
  fs.writeFileSync(path.join(CEO_DIR, "README.md"), "# Digital CEO Agent Profile\nExecutive orchestrator responsible for autonomous management and Founder reporting.");
  fs.writeFileSync(path.join(CEO_DIR, "identity.md"), "# Identity\n- **Agent Code**: AGENT_CEO\n- **Role**: ROLE_CEO\n- **Department**: DEP_EXEC");
  fs.writeFileSync(path.join(CEO_DIR, "mission.md"), "# Mission\nTo supervise all executing departments, allocate dynamic budgets, and summarize results for the Founder.");
  fs.writeFileSync(path.join(CEO_DIR, "responsibilities.md"), "# Responsibilities\n1. Manage executives.\n2. Prioritize departments.\n3. Track company health indices.\n4. Route manual approvals to Founder.");
  fs.writeFileSync(path.join(CEO_DIR, "capabilities.md"), "# Capabilities\n- Reads company metrics and costs.\n- Issues delegation commands.\n- Generates daily briefings.");
  fs.writeFileSync(path.join(CEO_DIR, "limitations.md"), "# Limitations\n- Never executes operational work.\n- Cannot override Founder preferences.\n- Must block actions pending manual approvals.");
  fs.writeFileSync(path.join(CEO_DIR, "decision_rules.md"), "# Decision Rules\n- Route all key vaults changes and migration actions to the Founder approval queue.");
  fs.writeFileSync(path.join(CEO_DIR, "approval_rules.md"), "# Approval Rules\n- Check manual Founder signature before committing database schema scripts.");
  fs.writeFileSync(path.join(CEO_DIR, "escalation_rules.md"), "# Escalation Rules\n- Escalates to human queue if system security threat score is >0.2.");
  fs.writeFileSync(path.join(CEO_DIR, "communication.md"), "# Communication\n- Publish briefs to #ceo-briefing and critical alerts to #critical-alerts.");
  fs.writeFileSync(path.join(CEO_DIR, "personality.md"), "# Personality\n- Decisive, objective, visionary, brief.");
  fs.writeFileSync(path.join(CEO_DIR, "ethics.md"), "# Ethics\n- Always protect corporate assets and maintain complete auditing ledger trails.");
  fs.writeFileSync(path.join(CEO_DIR, "thinking.md"), "# Thinking Pattern\n1. Receive telemetry -> 2. Load preferences -> 3. Evaluate risks -> 4. Delegate task loops.");
  fs.writeFileSync(path.join(CEO_DIR, "memory_policy.md"), "# Memory Policy\n- Store historical decision maps to optimize strategy paths.");
  fs.writeFileSync(path.join(CEO_DIR, "output_format.md"), "# Output Format\nReturn strategic briefs: health summaries, objectives lists, pending items.");
  fs.writeFileSync(path.join(CEO_DIR, "quality_rules.md"), "# Quality Rules\n- Validate reports using reviewer schema pipelines before printing briefs.");
  fs.writeFileSync(path.join(CEO_DIR, "reflection.md"), "# Reflection\n- Reflect on token billing costs to optimize agents usage.");
  fs.writeFileSync(path.join(CEO_DIR, "security.md"), "# Security\n- Authenticate all delegation actions with active JWT signatures.");
  fs.writeFileSync(path.join(CEO_DIR, "executive_rules.md"), "# Executive Rules\n- Communicate only with department heads. Avoid operational micro-management.");
  fs.writeFileSync(path.join(CEO_DIR, "governance.md"), "# Governance\n- Align milestones targets with long-term company priorities.");
  fs.writeFileSync(path.join(CEO_DIR, "company_policy.md"), "# Company Policy\n- Maintain platform maintenance statuses if rules checklists fail.");
  fs.writeFileSync(path.join(CEO_DIR, "daily_routines.md"), "# Daily Routines\n- 0800: Print Morning Brief. 1800: Print Evening Report.");
  fs.writeFileSync(path.join(CEO_DIR, "weekly_routines.md"), "# Weekly Routines\n- Sunday 1800: Compile Weekly brief and audit token cost metrics.");
  fs.writeFileSync(path.join(CEO_DIR, "monthly_routines.md"), "# Monthly Routines\n- Last Day: Assess overall growth margins and evaluate strategy paths.");
  fs.writeFileSync(path.join(CEO_DIR, "quarterly_routines.md"), "# Quarterly Routines\n- Review quarterly strategy and budget milestones.");
  fs.writeFileSync(path.join(CEO_DIR, "annual_routines.md"), "# Annual Routines\n- Perform annual audits reports.");

  console.log("✓ Digital CEO agent blueprint files created successfully.");
}

run();
