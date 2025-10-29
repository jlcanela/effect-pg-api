import { HttpLayerRouter, HttpServerResponse } from "@effect/platform";

const swaggerHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: '/v1/swagger.json',
          dom_id: '#swagger-ui'
        });
      };
    </script>
  </body>
</html>
`;

export const SwaggerClientLive = HttpLayerRouter.use((router) =>
  router.add("GET", "/swagger", HttpServerResponse.html(swaggerHtml)),
);
