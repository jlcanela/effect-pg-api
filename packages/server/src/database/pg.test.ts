import { Effect } from "effect";

import { PgLive } from './pg-live.js';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { TodoRepository} from "./todo-repository.js";

export const program = Effect.gen(function* () {
    const repo = yield* TodoRepository;

    yield* repo.delAll
    yield* repo.insertTodo({ title: "go to Bülach", completed: false, createdAt: new Date()});

    const search = "bulach";
    yield* Effect.logInfo(`searching for '${search}'`)

    const todos = yield* repo.findbytitle({title: search});
    yield* Effect.log(todos)
}).pipe(
    Effect.provide([PgLive, NodeContext.layer]),
    Effect.orDie
).pipe(
    Effect.provide(TodoRepository.Default),
)

NodeRuntime.runMain(program);

