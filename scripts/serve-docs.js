const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, "../openapi/openapi.yml"),
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "GitHub Workflows API",
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `📚 OpenAPI documentation available at http://localhost:${PORT}/api-docs`,
  );
  console.log(`Press Ctrl+C to stop`);
});
