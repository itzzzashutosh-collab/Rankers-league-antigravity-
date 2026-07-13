import fs from "fs";
import path from "path";

const BASE_DIR = path.resolve("shared");
const SKILLS = [
  "reasoning", "planning", "review", "verification", "communication",
  "research", "fact-checking", "tool-use", "reflection", "risk-analysis",
  "decision-making", "summarization", "json", "markdown"
];

const KNOWLEDGES = [
  "company", "platform", "engineering", "marketing", "finance",
  "education", "support", "security", "operations"
];

function buildSkillFile(skill, file) {
  const contentMap = {
    "purpose.md": `# Skill Purpose: ${skill.toUpperCase()}\nTo provide standard execution logic patterns for ${skill} operations.`,
    "rules.md": `# Operational Rules: ${skill.toUpperCase()}\n- Always ensure input args match expected types.\n- Perform validation checks before returning values.`,
    "workflow.md": `# Workflow Steps: ${skill.toUpperCase()}\n1. Parse context payloads\n2. Execute core logic\n3. Format returns`,
    "examples.md": `# Execution Examples: ${skill.toUpperCase()}\nInput: {"query": "test"}\nOutput: {"status": "success", "data": {}}`,
    "evaluation.md": `# Evaluation Metrics\n- Accuracy matches standard: >95%\n- Max processing latency: <1000ms`,
    "tests.md": `# Verification Tests\n- assert(input_valid === true)\n- assert(output_not_empty === true)`,
    "version.md": `# Version Control\nversion: "1.0.0"\nlast_updated: "${new Date().toISOString().split('T')[0]}"`
  };
  return contentMap[file] || "# Draft File";
}

function buildKnowledgeFile(repo, file) {
  const contentMap = {
    "metadata.yaml": `name: "${repo}_knowledge"\nversion: "1.0.0"\ncategory: "general"`,
    "index.md": `# Knowledge Index: ${repo.toUpperCase()}\nPrimary documentation mapping for ${repo} operational guidelines.`,
    "sources.md": `# Verified Information Sources\n- Standard operational handbook v1.2\n- Engineering team codebase architectures`,
    "taxonomy.md": `# Subject Taxonomy Nodes\n- Root\n  - ${repo} Category\n    - Details`,
    "version.md": `# Version registry\nversion: "1.0.0"\nlast_modified: "${new Date().toISOString().split('T')[0]}"`,
    "validation.md": `# Content validation criteria\n- Source check mandatory: Yes\n- Review signatures required: Yes`,
    "search.md": `# Document Search keywords\n- Keywords: ${repo}, config, details, overview`
  };
  return contentMap[file] || "# Draft File";
}

export function run() {
  console.log("Generating Shared Registries & Repositories...");

  // Generate Skills
  SKILLS.forEach(skill => {
    const dir = path.join(BASE_DIR, "skills", skill);
    fs.mkdirSync(dir, { recursive: true });
    ["purpose.md", "rules.md", "workflow.md", "examples.md", "evaluation.md", "tests.md", "version.md"].forEach(file => {
      fs.writeFileSync(path.join(dir, file), buildSkillFile(skill, file));
    });
  });
  console.log(`Generated ${SKILLS.length} skill directories successfully.`);

  // Generate Knowledge
  KNOWLEDGES.forEach(repo => {
    const dir = path.join(BASE_DIR, "knowledge", repo);
    fs.mkdirSync(dir, { recursive: true });
    ["metadata.yaml", "index.md", "sources.md", "taxonomy.md", "version.md", "validation.md", "search.md"].forEach(file => {
      fs.writeFileSync(path.join(dir, file), buildKnowledgeFile(repo, file));
    });
  });
  console.log(`Generated ${KNOWLEDGES.length} knowledge repositories successfully.`);
}

run();
