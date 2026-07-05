import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function resetDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // Drop all tables in the public schema
        console.log('Dropping all tables...');
        await client.query(`
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
        await client.query(`
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
        await client.query(`
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
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

resetDatabase();
