// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OpenRouter Proxy API",
      version: "1.0.0",
      description: "Proxy API to interact with OpenRouter language models",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
