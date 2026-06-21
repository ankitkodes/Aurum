import { json } from "drizzle-orm/pg-core";
import { numeric } from "drizzle-orm/pg-core";
import { pgEnum, uuid } from "drizzle-orm/pg-core";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";


export const User = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text().notNull(),
    address: text().notNull(),
    phoneNo: varchar({ length: 15 }).notNull().unique(),
    email: text().notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
});

export const accountEnum = pgEnum('account_type', ["Saving", "Current", "Salary"]);

export const Account = pgTable("account", {
    id: uuid('id').primaryKey().defaultRandom(),
    category: accountEnum('accountType').default("Current"),
    balance: numeric('balance', { precision: 15, scale: 2 }).notNull(),
    user_id: uuid('user_id').references(() => User.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()

});

export const TransactionTypeEnum = pgEnum('transaction_type_enums', ["Credit", "Debit"]);
export const StatusEnum = pgEnum('status', ["Pending", "Success", "Failure"]);

export const Transaction = pgTable("transaction", {
    id: uuid('id').primaryKey().defaultRandom(),
    transaction_amount: numeric('transaction_amount', { precision: 15, scale: 2 }).notNull(),
    sender_account_id: uuid('sender_account_id').references(() => Account.id).notNull(),
    receiver_account_id: uuid('receiver_account_id').references(() => Account.id).notNull(),
    transactionId: integer().unique().notNull(),
    transactionType: TransactionTypeEnum().default("Credit"),
    status: StatusEnum().default("Pending"),
    account_id: uuid('account_id').references(() => Account.id).notNull(),
    created_at: timestamp('created_at').defaultNow()
});

export const EntityTypeEnum = pgEnum('entity_type', ["User", "Account", "Transaction"]);

export const Audit_log = pgTable("audit_log", {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').references(() => User.id).notNull(),
    entity_id: integer('updated_entity_id').notNull(),
    action: varchar({ length: 225 }).notNull(),
    entity_type: EntityTypeEnum().default("User"),
    metadata: json().notNull(),
    created_at: timestamp('created_at').defaultNow()
})


// type of all table

export const UserSchema = createInsertSchema(User);

export const AccountSchema = createInsertSchema(Account);




