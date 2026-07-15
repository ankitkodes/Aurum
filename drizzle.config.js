"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: ['./src/db/schema.ts'],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: (_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : 'postgresql://postgres:admin@localhost:5432/aurum',
    },
    migrations: {
        table: 'drizzle_migrations',
    },
});
