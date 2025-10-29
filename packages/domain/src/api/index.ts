import { HttpApi } from "@effect/platform";
import { HealthGroup } from "./health.js";

export class DomainApi extends HttpApi.make("DomainApi")
  .add(HealthGroup)
  .prefix("/api") {}
  