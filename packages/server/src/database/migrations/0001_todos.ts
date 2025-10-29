import { SqlClient  } from "@effect/sql";
import { Effect } from "effect";

// eslint-disable-next-line no-restricted-syntax
export default Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`
        CREATE EXTENSION IF NOT EXISTS unaccent;
        `;

    yield* sql`
        CREATE TABLE todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        title_unaccent TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
        `;

    yield* sql`
        CREATE OR REPLACE FUNCTION set_title_unaccent() RETURNS trigger AS $$
        BEGIN
            NEW.title_unaccent := lower(unaccent(NEW.title));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `;

    yield* sql`
        CREATE TRIGGER todos_title_unaccent_trg
        BEFORE INSERT OR UPDATE ON todos
        FOR EACH ROW EXECUTE FUNCTION set_title_unaccent();
        `;

    yield* sql`
        CREATE INDEX todos_title_fts_idx
        ON todos
        USING GIN (to_tsvector('simple', title_unaccent));
        `;
    
});
