import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { parse, subDays } from "date-fns";
import { 
    transactions, 
    insertTransactionSchema, 
    categories, 
    accounts
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
.get(
    "/",
    zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query")
      

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = to 
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;
  
      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
            and(
                accountId ? eq(transactions.accountId, accountId) : undefined,
                eq(accounts.userId, auth.userId),
                gte(transactions.date, startDate),
                lte(transactions.date, endDate),
            )
        )
        .orderBy(desc(transactions.date))

      return c.json({ data });
    }
)
.get(
    "/:id",
    clerkMiddleware(),
    zValidator(
        "param",
        z.object({
            id: z.string().optional(),
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
            .select({
                id: transactions.id,
                date: transactions.date,
                // category: categories.name,
                categoryId: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amount,
                notes: transactions.notes,
                // account: accounts.name,
                accountId: transactions.accountId,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
                and(
                    eq(transactions.id, id),
                    eq(accounts.userId, auth.userId),
                )
            );
            
        if (!data) {
            return c.json({ error: "Account not found" }, 404);
        }
        
        return c.json({ data });
    }
)
.post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
        id: true,
    })),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        try {
            const [data] = await db.insert(transactions).values({
                id: createId(), 
                ...values,
            }).returning();

            console.log("Inserted Transaction:", data);

            return c.json({ data });
        } catch (error) {
            console.error("Failed to insert transaction:", error);
            return c.json({ error: "Failed to create transaction" }, 500);
        }
    }
)

.post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
        "json",
        z.array(
            insertTransactionSchema.extend({
                amount: z.number(),
                payee: z.string(),
                accountId: z.string(),
                notes: z.string().optional(),
                categoryId: z.string().optional(),
            }).omit({
                id: true,
            }),
        ),
    ),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const data = await db
            .insert(transactions)
            .values(
                values.map((values) => ({
                    id: createId(),
                    date: new Date(), // Provide a default or valid date
                    amount: values.amount, // Ensure `amount` is included in the input
                    payee: values.payee, // Ensure `payee` is included in the input
                    accountId: values.accountId, // Ensure `accountId` is included in the input
                    notes: values.notes, // Optional field
                    categoryId: values.categoryId, // Optional field
                }))
            )
            .returning(); 

            return c.json({ data })
    }
)
.post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        const transactionsToDelete = db.$with("transactions_to_delete").as(
            db.select({ id: transactions.id }).from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
                inArray(transactions.id, values.ids),
                eq(accounts.userId, auth.userId),
            )),
        );
        const data = await db
            .with(transactionsToDelete)
            .delete(transactions)
            .where(
                inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
            )
            .returning({
                id: transactions.id,
            })

        return c.json({ data })
    },
)
.patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
        "param",
        z.object({
            id: z.string().optional(),
        }),
    ),
    zValidator(
        "json",
        insertTransactionSchema.omit({
            id: true,
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param")
        const values = c.req.valid("json")

        if(!id) {
            return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        const transactionsToUpdate = db.$with("transactions_to_update").as(
            db.select({ id: transactions.id }).from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
                eq(transactions.id, id),
                eq(accounts.userId, auth.userId),
            )),
        );

        const [data] = await db
            .with(transactionsToUpdate)
            .update(transactions)
            .set(values)
            .where(
                inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
            )
            .returning()
            
        if (!data) {
            return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data })
    },
)
.delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
        "param",
        z.object({
            id: z.string().optional(),
        }),
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param")

        if(!id) {
            return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        const transactionsToDelete = db.$with("transactions_to_delete").as(
            db.select({ id: transactions.id }).from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
                eq(transactions.id, id),
                eq(accounts.userId, auth.userId),
            )),
        );

        const [data] = await db
            .with(transactionsToDelete)
            .delete(transactions)
            .where(
                inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
            )
            .returning({
                id: transactions.id,
            });

        if (!data) {
            return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data })
    },
);

export default app;