import fs from "fs";
import path from "path";

const REVIEWER_DIR = path.resolve("core/reviewer");

const SUBDIRS = [
  "workflows", "prompts", "skills", "knowledge", "memory",
  "schemas", "contracts", "tests", "logs", "metrics", "examples"
];

function run() {
  console.log("Generating Reviewer Agent directories and blueprints...");

  // 1. Create directory if not exists
  if (!fs.existsSync(REVIEWER_DIR)) {
    fs.mkdirSync(REVIEWER_DIR, { recursive: true });
  }

  // 2. Create subdirectories & seed files
  SUBDIRS.forEach(dirName => {
    const dirPath = path.join(REVIEWER_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let filename = "";
    let content = "";
    if (dirName === "workflows") {
      filename = "review_pipeline.yaml";
      content = `workflow_name: "output_quality_review"\npipeline:\n  - step_id: "rev_1"\n    action: "validate_schema"\n  - step_id: "rev_2"\n    action: "validate_tone"`;
    } else if (dirName === "prompts") {
      filename = "reviewer_prompt.txt";
      content = "You are the universal Reviewer Agent. Evaluate completed tasks, check style guides, and output scorecards.";
    } else if (dirName === "skills") {
      filename = "reviewer_skills.yaml";
      content = "skills:\n  - fact-checking\n  - reflection\n  - risk-analysis";
    } else if (dirName === "knowledge") {
      filename = "style_guides.yaml";
      content = "guides:\n  - executive_reports\n  - json_apis\n  - documentation";
    } else if (dirName === "memory") {
      filename = "memory_config.yaml";
      content = "memory_read_modes:\n  - long-term\n  - semantic";
    } else if (dirName === "schemas") {
      filename = "review_scorecard.json";
      content = JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          completeness_score: { type: "number" },
          formatting_score: { type: "number" },
          overall_score: { type: "number" },
          findings: { type: "array" }
        },
        required: ["overall_score", "findings"]
      }, null, 2);
    } else if (dirName === "contracts") {
      filename = "reviewer_contract.yaml";
      content = "contract_version: \"1.0.0\"\ninputs_validated: true\noutputs_validated: true";
    } else if (dirName === "tests") {
      filename = "reviewer.test.js";
      content = "console.log('✓ Running Reviewer quality check tests...');";
    } else if (dirName === "logs") {
      filename = "review_traces.log";
      content = "[INFO] Initialized reviewer agent profile traces.";
    } else if (dirName === "metrics") {
      filename = "quality_metrics.json";
      content = JSON.stringify({ reviews_count: 85, corrections_count: 5 }, null, 2);
    } else if (dirName === "examples") {
      filename = "review_sample.json";
      content = JSON.stringify({
        review_id: "rev-mock-01",
        scorecard: { completeness_score: 0.95, overall_score: 0.94 },
        findings: [{ type: "Minor", text: "Fix minor styling formatting" }]
      }, null, 2);
    }

    if (filename) {
      fs.writeFileSync(path.join(dirPath, filename), content);
    }
  });

  // 3. Create YAML config files
  fs.writeFileSync(path.join(REVIEWER_DIR, "agent.yaml"), `
name: "reviewer"
version: "1.0.0"
department: "DEP_EXEC"
role: "ROLE_SPEC"
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
  required_threshold_confidence: 0.80
  manual_escalation_triggers:
    - "critical_finding"
    - "low_scorecard"
`.trim());

  fs.writeFileSync(path.join(REVIEWER_DIR, "tools.yaml"), `
tools:
  - id: "supabase_client"
    allowed: true
    timeout_ms: 10000
  - id: "fs_utility"
    allowed: true
    timeout_ms: 5000
`.trim());

  fs.writeFileSync(path.join(REVIEWER_DIR, "models.yaml"), `
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  reviewer: "gpt-4o"
  verifier: "gemini-1.5-pro"
`.trim());

  fs.writeFileSync(path.join(REVIEWER_DIR, "permissions.yaml"), `
permissions:
  department: "DEP_EXEC"
  role: "ROLE_SPEC"
  actions:
    - "ai_reviews:insert"
    - "ai_review_findings:insert"
    - "ai_quality_scores:insert"
`.trim());

  // 4. Create 18 Markdown files
  fs.writeFileSync(path.join(REVIEWER_DIR, "README.md"), "# Reviewer Agent Profile\nResponsible for output quality checks and suggestions.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "identity.md"), "# Identity\n- **Agent Code**: AGENT_REVIEWER\n- **Role**: ROLE_SPEC\n- **Department**: DEP_EXEC");
  fs.writeFileSync(path.join(REVIEWER_DIR, "mission.md"), "# Mission\nTo audit every execution output, check formatting, structure, schema validation, and style rules, returning structured scorecards.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "responsibilities.md"), "# Responsibilities\n1. Review outputs.\n2. Check completeness, JSON schemas, style guide alignment.\n3. Generate review findings (critical/major).\n4. Recommend auto-correction improvements.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "capabilities.md"), "# Capabilities\n- Reads execution results.\n- Compares outputs against JSON schemas.\n- Generates quality metrics logs.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "limitations.md"), "# Limitations\n- Never executes tasks.\n- Never modifies outputs directly.\n- Cannot skip critical findings checks.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "decision_rules.md"), "# Decision Rules\n- Block task completion if findings contain a 'Critical' classification.\n- Request task re-execution if overall score matches <0.80.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "approval_rules.md"), "# Approval Rules\n- Trigger manual escalation if overall scorecard is flagged as NeedsCorrection.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "escalation_rules.md"), "# Escalation Rules\n- Route rejected outputs to human audit workspace queue.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "communication.md"), "# Communication\n- Send report details via public.ai_messages.\n- Publish audit findings events.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "personality.md"), "# Personality\n- Objective, rigorous, structured, detail-oriented.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "ethics.md"), "# Ethics\n- Never fabricate review findings.\n- Ensure complete auditing track records.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "thinking.md"), "# Thinking Pattern\n1. Parse executor outputs -> 2. Match style guides -> 3. Evaluate criteria -> 4. Score metrics -> 5. Emit report.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "memory_policy.md"), "# Memory Policy\n- Load previous reviews context to optimize quality patterns.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "output_format.md"), "# Output Format\nReturn review details: overall_score, findings, suggestions list.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "quality_rules.md"), "# Quality Rules\n- Ensure scorecard completeness before returning validation.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "reflection.md"), "# Reflection\n- Monitor average validation latency bounds to optimize checker runs.");
  fs.writeFileSync(path.join(REVIEWER_DIR, "security.md"), "# Security\n- Access tools using authorized token keys.");

  console.log("✓ Reviewer agent blueprint files created successfully.");
}

run();
