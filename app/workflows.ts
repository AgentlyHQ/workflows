import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface WorkflowMetadata {
  slug: string;
  name: string;
  description: string;
  license: string;
  metadata: {
    category: string;
  };
  agents: string[];
  variables: string[];
}

export interface WorkflowContent extends WorkflowMetadata {
  content: string;
}

const workflowsDir = path.join(process.cwd(), "workflows");

function extractAgents(content: string): string[] {
  const matches = content.matchAll(/eip155:\d+\/erc8004:0x[a-fA-F0-9]+\/\d+/g);
  return [...new Set([...matches].map((m) => m[0]))];
}

function extractVariables(content: string): string[] {
  const matches = content.matchAll(/\$\{([A-Z_]+)\}/g);
  return [...new Set([...matches].map((m) => m[1]))].filter(
    (v) => v !== "NAME_OF_VARIABLE",
  );
}

export function getWorkflows(): WorkflowMetadata[] {
  const slugs = fs
    .readdirSync(workflowsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return slugs.map((slug) => {
    const filePath = path.join(workflowsDir, slug, "SKILL.md");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      name: data.name,
      description: data.description,
      license: data.license,
      metadata: data.metadata,
      agents: extractAgents(content),
      variables: extractVariables(content),
    };
  });
}

export function getWorkflow(slug: string): WorkflowContent | null {
  const filePath = path.join(workflowsDir, slug, "SKILL.md");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    name: data.name,
    description: data.description,
    license: data.license,
    metadata: data.metadata,
    agents: extractAgents(content),
    variables: extractVariables(content),
    content: content.trim(),
  };
}
