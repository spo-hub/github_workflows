const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");

// Load OpenAPI spec
const openApiPath = path.join(__dirname, "../openapi/openapi.yml");
const spec = YAML.load(openApiPath);

// Output file
const outputPath = path.join(
  __dirname,
  "../frontend/src/app/schemas/generated/schemas.ts",
);

// Generate Zod schemas from OpenAPI components
function generateZodSchemas(spec) {
  const schemas = spec.components?.schemas || {};
  let output = `import { z } from 'zod';\n\n`;
  output += `// Auto-generated from OpenAPI spec\n`;
  output += `// Do not edit manually\n\n`;

  for (const [name, schema] of Object.entries(schemas)) {
    output += generateSchema(name, schema);
    output += `\n`;
  }

  return output;
}

function generateSchema(name, schema) {
  let code = `// ${name}\n`;
  code += `export const ${name}Schema = ${convertSchema(schema)};\n`;
  code += `export type ${name} = z.infer<typeof ${name}Schema>;\n`;
  return code;
}

function convertSchema(schema) {
  if (schema.enum) {
    const values = schema.enum.map((v) => `'${v}'`).join(", ");
    return `z.enum([${values}])`;
  } else if (schema.type === "object") {
    return convertObject(schema);
  } else if (schema.type === "array") {
    return `z.array(${convertSchema(schema.items)})`;
  } else if (schema.type === "string") {
    return convertString(schema);
  } else if (schema.type === "number" || schema.type === "integer") {
    return "z.number()";
  } else if (schema.type === "boolean") {
    return "z.boolean()";
  }
  return "z.unknown()";
}

function convertObject(schema) {
  const properties = schema.properties || {};
  const required = schema.required || [];

  let props = [];
  for (const [key, prop] of Object.entries(properties)) {
    const isRequired = required.includes(key);
    const zodType = convertSchema(prop);
    const optional = isRequired ? "" : ".optional()";
    props.push(`  ${key}: ${zodType}${optional}`);
  }

  return `z.object({\n${props.join(",\n")}\n})`;
}

function convertString(schema) {
  let base = "z.string()";

  if (schema.format === "email") {
    base = "z.email()";
  } else if (schema.format === "uri") {
    base += ".url()";
  }

  if (schema.minLength) {
    base += `.min(${schema.minLength})`;
  }
  if (schema.maxLength) {
    base += `.max(${schema.maxLength})`;
  }

  return base;
}

// Generate and write
const code = generateZodSchemas(spec);

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, code);
console.log(`✅ Generated Zod schemas at ${outputPath}`);
