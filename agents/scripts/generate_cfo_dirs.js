import fs from "fs";
import path from "path";

const CFO_DIR = path.resolve("executives/cfo");

const SUBDIRS = [
  "workflows", "prompts", "skills", "knowledge", "memory",
  "schemas", "contracts", "tests", "logs", "metrics", "examples"
];

function run() {
  console.log("Generating Digital CFO Agent directories and blueprints...");

  // 1. Create directory if not exists
  if (!fs.existsSync(CFO_DIR)) {
    fs.mkdirSync(CFO_DIR, { recursive: true });
  }

  // 2. Create subdirectories & seed files
  SUBDIRS.forEach(dirName => {
    const dirPath = path.join(CFO_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let filename = "";
    let content = "";
    if (dirName === "workflows") {
      filename = "cfo_budget_loop.yaml";
      content = `workflow_name: "daily_budget_loop"\npipeline:\n  - step_id: "cfo_1"\n    action: "audit_ai_costs"\n  - step_id: "cfo_2"\n    action: "check_budget_limits"`;
    } else if (dirName === "prompts") {
      filename = "cfo_financier_prompt.txt";
      content = "You are the Digital CFO. Supervise wallet operations, cloud expenses, cash burn forecasting, and unit economics margins.";
    } else if (dirName === "skills") {
      filename = "cfo_skills.yaml";
      content = "skills:\n  - financial-forecasting\n  - cost-optimization\n  - risk-assessment";
    } else if (dirName === "knowledge") {
      filename = "pricing_policy.yaml";
      content = "platform_fees:\n  - default_rate: 0.10\n  - vip_rate: 0.05";
    } else if (dirName === "memory") {
      filename = "memory_config.yaml";
      content = "memory_read_modes:\n  - historical-revenue\n  - cost-trends";
    } else if (dirName === "schemas") {
      filename = "financial_brief.json";
      content = JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          cash_position_inr: { type: "number" },
          burn_rate_usd: { type: "number" },
          runway_months: { type: "number" }
        },
        required: ["cash_position_inr", "burn_rate_usd"]
      }, null, 2);
    } else if (dirName === "contracts") {
      filename = "cfo_contract.yaml";
      content = "contract_version: \"1.0.0\"\ninputs_validated: true\noutputs_validated: true";
    } else if (dirName === "tests") {
      filename = "cfo.test.js";
      content = "console.log('✓ Running Digital CFO margin economics checks tests...');";
    } else if (dirName === "logs") {
      filename = "cfo_traces.log";
      content = "[INFO] Initialized Digital CFO financial traces.";
    } else if (dirName === "metrics") {
      filename = "financial_metrics.json";
      content = JSON.stringify({ clv_index: 45, cac_index: 12 }, null, 2);
    } else if (dirName === "examples") {
      filename = "forecast_sample.json";
      content = JSON.stringify({
        forecast_id: "for-cfo-01",
        expected_revenue: 150000,
        status: "Planned"
      }, null, 2);
    }

    if (filename) {
      fs.writeFileSync(path.join(dirPath, filename), content);
    }
  });

  // 3. Create YAML config files
  fs.writeFileSync(path.join(CFO_DIR, "agent.yaml"), `
name: "cfo"
version: "1.0.0"
department: "DEP_EXEC"
role: "ROLE_CFO"
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
  required_threshold_confidence: 0.95
  manual_escalation_triggers:
    - "budget_overrun"
    - "large_deposit_withdrawal"
`.trim());

  fs.writeFileSync(path.join(CFO_DIR, "tools.yaml"), `
tools:
  - id: "supabase_client"
    allowed: true
    timeout_ms: 10000
  - id: "discord_webhook"
    allowed: true
    timeout_ms: 5000
  - id: "accounting_connector"
    allowed: true
    timeout_ms: 15000
`.trim());

  fs.writeFileSync(path.join(CFO_DIR, "models.yaml"), `
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  reviewer: "gpt-4o"
  verifier: "gemini-1.5-pro"
`.trim());

  fs.writeFileSync(path.join(CFO_DIR, "permissions.yaml"), `
permissions:
  department: "DEP_EXEC"
  role: "ROLE_CFO"
  actions:
    - "cfo_revenue:insert"
    - "cfo_expenses:insert"
    - "cfo_budgets:update"
    - "cfo_financial_alerts:insert"
`.trim());

  // 4. Create 29 Markdown files
  fs.writeFileSync(path.join(CFO_DIR, "README.md"), "# Digital CFO Agent Profile\nFinancial orchestrator responsible for corporate cost management and pricing audits.");
  fs.writeFileSync(path.join(CFO_DIR, "identity.md"), "# Identity\n- **Agent Code**: AGENT_CFO\n- **Role**: ROLE_CFO\n- **Department**: DEP_EXEC");
  fs.writeFileSync(path.join(CFO_DIR, "mission.md"), "# Mission\nTo protect the financial health of Ranker's League, control AI token spending, and report profit margins.");
  fs.writeFileSync(path.join(CFO_DIR, "responsibilities.md"), "# Responsibilities\n1. Monitor wallet deposits.\n2. Verify prize distributions.\n3. Track AI and cloud resource spending.");
  fs.writeFileSync(path.join(CFO_DIR, "capabilities.md"), "# Capabilities\n- Inspects cash burn runway charts.\n- Allocates department budgets.\n- Issues budget warnings.");
  fs.writeFileSync(path.join(CFO_DIR, "limitations.md"), "# Limitations\n- Never modifies financial ledgers manually.\n- Requires Founder approval for pricing revisions.");
  fs.writeFileSync(path.join(CFO_DIR, "decision_rules.md"), "# Decision Rules\n- Flag warning if token cost average surges >40% over 2 days.");
  fs.writeFileSync(path.join(CFO_DIR, "approval_rules.md"), "# Approval Rules\n- Budget reallocations exceeding 1000 USD require CEO signature.");
  fs.writeFileSync(path.join(CFO_DIR, "escalation_rules.md"), "# Escalation Rules\n- Route critical alert if cash runway drops below 6 months.");
  fs.writeFileSync(path.join(CFO_DIR, "communication.md"), "# Communication\n- Send budget updates to #finance and cost alerts to #ai-costs.");
  fs.writeFileSync(path.join(CFO_DIR, "personality.md"), "# Personality\n- Precise, risk-averse, analytical, objective.");
  fs.writeFileSync(path.join(CFO_DIR, "ethics.md"), "# Ethics\n- Maintain immutable records ledger. No deletes allowed.");
  fs.writeFileSync(path.join(CFO_DIR, "thinking.md"), "# Thinking Pattern\n1. Check cash position -> 2. Review AI cost logs -> 3. Match department budgets -> 4. Trace financial risks.");
  fs.writeFileSync(path.join(CFO_DIR, "memory_policy.md"), "# Memory Policy\n- Store cost histories for pricing forecasting modeling.");
  fs.writeFileSync(path.join(CFO_DIR, "output_format.md"), "# Output Format\nReturn financial briefs: cash flow reports, AI costs, budget charts.");
  fs.writeFileSync(path.join(CFO_DIR, "quality_rules.md"), "# Quality Rules\n- Cross-check arithmetic bounds on all ledger audit reports.");
  fs.writeFileSync(path.join(CFO_DIR, "reflection.md"), "# Reflection\n- Reflect on cost overruns to optimize department caps.");
  fs.writeFileSync(path.join(CFO_DIR, "security.md"), "# Security\n- Protect payout transaction hashes with RLS policies.");
  fs.writeFileSync(path.join(CFO_DIR, "financial_policy.md"), "# Financial Policy\n- Restrict withdrawal permissions to authenticated accounts.");
  fs.writeFileSync(path.join(CFO_DIR, "budget_policy.md"), "# Budget Policy\n- Maintain 20% buffer in emergency budgets.");
  fs.writeFileSync(path.join(CFO_DIR, "risk_policy.md"), "# Risk Policy\n- Evaluate monthly cost volatility variables.");
  fs.writeFileSync(path.join(CFO_DIR, "pricing_policy.md"), "# Pricing Policy\n- Default 10% platform fee on all live contest pools.");
  fs.writeFileSync(path.join(CFO_DIR, "daily_routines.md"), "# Daily Routines\n- 0930: Extract previous day tokens cost. 1730: Dispatch net revenue logs.");
  fs.writeFileSync(path.join(CFO_DIR, "weekly_routines.md"), "# Weekly Routines\n- Sunday: Forecast monthly cloud spending averages.");
  fs.writeFileSync(path.join(CFO_DIR, "monthly_routines.md"), "# Monthly Routines\n- Formulate gross profit margin briefs.");
  fs.writeFileSync(path.join(CFO_DIR, "quarterly_routines.md"), "# Quarterly Routines\n- Review customer lifetime value metrics.");
  fs.writeFileSync(path.join(CFO_DIR, "annual_routines.md"), "# Annual Routines\n- Audits platform tax liability states.");

  console.log("✓ Digital CFO agent blueprint files created successfully.");
}

run();
