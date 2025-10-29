import { SqlClient, SqlSchema } from "@effect/sql";
import { Effect, Schema, flow } from "effect";
import { PgLive } from "./pg-live.js"

// eslint-disable-next-line no-use-before-define
export class Todo extends Schema.Class<Todo>("Todo")({
    id: Schema.String,
    title: Schema.String,
    completed: Schema.Boolean,
    createdAt: Schema.DateFromString,
}) { };

const DieOnError = Effect.catchTags({
    ParseError: (parseError) => Effect.die(parseError),
    SqlError: (sqlError) => Effect.die(sqlError)
});

// eslint-disable-next-line no-use-before-define
export class TodoRepository extends Effect.Service<TodoRepository>()("TodoRepository", {
    dependencies: [PgLive],
    effect: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;

        return {
            insertTodo: flow(
                SqlSchema.single({
                    Request: Schema.Struct({
                        title: Schema.String,
                        completed: Schema.Boolean,
                        createdAt: Schema.DateFromString,
                    }),
                    Result: Todo,
                    execute: (request) => sql`INSERT INTO todos ${sql.insert(request).returning("*")}`
                }),
                Effect.catchTags({
                    NoSuchElementException: () => Effect.dieMessage("INSERT INTO todos did not return anything"),
                    ParseError: (parseError) => Effect.die(parseError),
                    SqlError: (sqlError) => Effect.die(sqlError)
                }),
                Effect.withSpan("insertTodo"),
            ),
            del: flow(
                SqlSchema.void({
                    Request: Schema.Struct({
                        id: Schema.String
                    }),
                    execute: (request) =>
                        sql`DELETE FROM todos WHERE id = ${request.id}`,
                }),
                Effect.withSpan("del"),
                DieOnError,
            ),
            delAll: flow(
                SqlSchema.void({
                    Request: Schema.Void,
                    execute: () =>
                        sql`DELETE FROM todos`,
                }),
                Effect.withSpan("delAll"),
                DieOnError,
            )(),
            findbytitle: flow(
                SqlSchema.findAll({
                    Request: Schema.Struct({
                        title: Schema.String
                    }),
                    Result: Todo,
                    execute: (request) => sql`SELECT * FROM todos WHERE to_tsvector('simple', title_unaccent) @@ to_tsquery('simple', ${request.title});`,
                }),
                Effect.withSpan("findbytitle"),
                DieOnError,
            ),
            findall: flow(
                SqlSchema.findAll({
                    Request: Schema.Void,
                    Result: Todo,
                    execute: () => sql`SELECT * FROM todos`,
                }),
                Effect.withSpan("findall"),
                DieOnError,
            )
        };
    })
}) { }
