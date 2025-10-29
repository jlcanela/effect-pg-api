import { FetchHttpClient, HttpApiBuilder, HttpLayerRouter, HttpServer } from "@effect/platform";


import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { SwaggerClientLive } from "./lib/SwaggerClientLive.js";
import { DomainApi } from "@org/domain/api/index";
import { Effect, Layer } from "effect";
import { createServer } from "http";
import { DevTools } from "@effect/experimental"
import { TelemetryLive } from "./lib/telemetry.js";

const ApiLive = HttpLayerRouter.addHttpApi(DomainApi, {
  openapiPath: "/v1/swagger.json",
});

export const HealthLive = HttpApiBuilder.group(DomainApi, "health", (handlers) =>
  handlers.handle("health", () =>
    Effect.withSpan("health")(Effect.succeed("OK").pipe(Effect.withLogSpan("message"))),
  ),
);

const AllRoutes = Layer.mergeAll(ApiLive, SwaggerClientLive).pipe(
  Layer.provide(Layer.mergeAll(HealthLive)),
);

const portEnv = process.env.PORT;
const port = Number.isInteger(Number(portEnv)) && Number(portEnv) > 0 ? Number(portEnv) : 3000;

const HttpLive = HttpLayerRouter.serve(AllRoutes).pipe(
  HttpServer.withLogAddress,
  Layer.provide(
    NodeHttpServer.layer(createServer, {
      port,
    }),
  ),
  Layer.provide(TelemetryLive),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(DevTools.layer())
);

NodeRuntime.runMain(Layer.launch(HttpLive), { disablePrettyLogger: true });
