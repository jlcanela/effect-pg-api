import { Effect } from "effect";

import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { TodoRepository} from "./todo-repository.js";

export const program = Effect.gen(function* () {
    const repo = yield* TodoRepository;

    yield* repo.delAllTodos
    yield* repo.insertTodo({ title: "go to Bülach", completed: false, createdAt: new Date()});

    const search = "bulach";
    yield* Effect.logInfo(`searching for '${search}'`)
    const todos = yield* repo.findTodoByTitle({title: search});
    yield* Effect.log(todos)

    const search2 = "buelach";
    yield* Effect.logInfo(`searching for '${search2}'`)
    const todos2 = yield* repo.findTodoByTitle({title: search2});
    yield* Effect.log(todos2)

}).pipe(
    Effect.provide([NodeContext.layer]),
    Effect.orDie
).pipe(
    Effect.provide(TodoRepository.Default),
)

NodeRuntime.runMain(program);

