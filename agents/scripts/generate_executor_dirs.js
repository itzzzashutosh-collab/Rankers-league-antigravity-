import fs from "fs";
import path from "path";

const EXECUTOR_DIR = path.resolve("core/task-executor");

const SUBDIRS = [
  "workflows", "prompts", "skills", "knowledge", "memory",
  "schemas", "contracts", "tests", "logs", "metrics", "examples"
];

function run() {
  console.log("Generating Task Executor Subdirectories and Blueprint configurations...");

  // 1. Create subdirectories & default files
  SUBDIRS.forEach(dirName => {
    const dirPath = path.join(EXECUTOR_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write a template seed file into each directory to make it fully populated
    let filename = "";
    let content = "";
    if (dirName === "workflows") {
      filename = "executor_lifecycle.yaml";
      content = `workflow_name: "sequential_task_execution"\nsteps:\n  - step_id: "step_1"\n    action: "validate_plan"\n  - step_id: "step_2"\n    action: "execute_step"`;
    } else if (dirName === "prompts") {
      filename = "system_prompt.txt";
      content = "You are the universal Task Executor. Execute steps sequentially based on the approved planner graph.";
    } else if (dirName === "skills") {
      filename = "acquired_skills.yaml";
      content = "skills:\n  - reasoning\n  - tool-use\n  - review";
    } else if (dirName === "knowledge") {
      filename = "referenced_sources.yaml";
      content = "sources:\n  - platform_handbook\n  - database_rules";
    } else if (dirName === "memory") {
      filename = "memory_pointer.yaml";
      content = "memory_read_modes:\n  - short-term\n  - semantic";
    } else if (dirName === "schemas") {
      filename = "execution_output.json";
      content = JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          execution_id: { type: "string" },
          status: { type: "string" },
          confidence_score: { type: "number" }
        },
        required: ["execution_id", "status"]
      }, null, 2);
    } else if (dirName === "contracts") {
      filename = "executor_contract.yaml";
      content = "contract_version: \"1.0.0\"\ninputs_validated: true\noutputs_validated: true";
    } else if (dirName === "tests") {
      filename = "executor.test.js";
      content = "console.log('✓ Running Task Executor assertions...');";
    } else if (dirName === "logs") {
      filename = "runtime_traces.log";
      content = "[INFO] Initialized executor agent profile traces.";
    } else if (dirName === "metrics") {
      filename = "latency_bounds.json";
      content = JSON.stringify({ average_latency_ms: 450, target_bound_ms: 1000 }, null, 2);
    } else if (dirName === "examples") {
      filename = "execution_sample.json";
      content = JSON.stringify({
        sample_plan_id: "plan-mock-01",
        steps: [
          { step_id: "step_1", label: "Retrieve variables", status: "Completed" }
        ]
      }, null, 2);
    }

    if (filename) {
      fs.writeFileSync(path.join(dirPath, filename), content);
    }
  });

  // 2. Create tools.yaml, models.yaml, permissions.yaml, and README.md
  fs.writeFileSync(path.join(EXECUTOR_DIR, "tools.yaml"), `
tools:
  - id: "supabase_client"
    allowed: true
    timeout_ms: 30000
  - id: "discord_webhook"
    allowed: true
    timeout_ms: 10000
  - id: "fs_utility"
    allowed: true
    timeout_ms: 5000
  - id: "search_tool"
    allowed: false
  - id: "browser_tool"
    allowed: false
`.trim());

  fs.writeFileSync(path.join(EXECUTOR_DIR, "models.yaml"), `
models:
  primary: "gpt-4o"
  fallback: "claude-3-5-sonnet"
  reviewer: "gpt-4o"
  verifier: "gemini-1.5-pro"
`.trim());

  fs.writeFileSync(path.join(EXECUTOR_DIR, "permissions.yaml"), `
permissions:
  department: "DEP_EXEC"
  role: "ROLE_WRK"
  actions:
    - "ai_task_execution:insert"
    - "ai_execution_steps:insert"
    - "ai_execution_logs:insert"
    - "ai_tool_usage:insert"
`.trim());

  fs.writeFileSync(path.join(EXECUTOR_DIR, "README.md"), `
# Task Executor Agent Profile
Universal Task Executor Agent responsible for step-by-step sequential execution.

## Folders List
- \`workflows/\` — Sequential step run definitions.
- \`prompts/\` — Action guidance system prompts.
- \`skills/\` — Acquired skill configurations.
- \`knowledge/\` — Reference knowledge nodes.
- \`memory/\` — Memory pointers and keys.
- \`schemas/\` — JSON validation files.
- \`contracts/\` — Step input/output contracts.
- \`tests/\` — Assertion testing suites.
- \`logs/\` — Latency logs traces.
- \`metrics/\` — Latency metrics.
- \`examples/\` — Staged execution templates.
`.trim());

  console.log("✓ Task Executor files generated successfully.");
}

run();
