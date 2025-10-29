import * as Otlp from "@effect/opentelemetry/Otlp";
import { FetchHttpClient } from "@effect/platform";
import { Layer } from "effect";

export const TelemetryLive = Otlp.layer({
  baseUrl: "http://localhost:4318",
  resource: {
    serviceName: "api-server"
  }
}).pipe(Layer.provide(FetchHttpClient.layer))
