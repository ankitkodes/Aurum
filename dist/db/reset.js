var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
        });
        try {
            yield client.connect();
            console.log('Connected to database.');
            // Drop all tables in the public schema
            console.log('Dropping all tables...');
            yield client.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
            console.log('All tables dropped.');
            // Drop all custom enum types
            console.log('Dropping all custom enums...');
            yield client.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (
                    SELECT t.typname
                    FROM pg_type t
                    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
                    WHERE n.nspname = 'public' AND t.typtype = 'e'
                ) LOOP
                    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
                END LOOP;
            END $$;
        `);
            console.log('All enums dropped.');
            // Drop all sequences
            console.log('Dropping all sequences...');
            yield client.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequencename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
            console.log('All sequences dropped.');
            console.log('\n✅ Database fully reset! All schemas dropped.');
        }
        catch (error) {
            console.error('❌ Error resetting database:', error);
            process.exit(1);
        }
        finally {
            yield client.end();
        }
    });
}
resetDatabase();
