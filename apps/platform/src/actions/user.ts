import type { InferSelectModel } from "drizzle-orm";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";

// Infer the user model type from the schema
type User = InferSelectModel<typeof users>;

// Get user by Email
export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user.length > 0 ? user[0] : null;
}

// Get user by User ID
export async function getUserById(userId: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user.length > 0 ? user[0] : null;
}

// Get user by Username
export async function getUserByUsername(username: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user.length > 0 ? user[0] : null;
}



// Update user by ID
export async function updateUserById(userId: string, updates: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db.update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
    return updatedUser || null;
}



// Get all users by role
export async function getUsersByRole(role: string): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, role));
}

// Get users by department
export async function getUsersByDepartment(department: string): Promise<User[]> {
    return db.select().from(users).where(eq(users.department, department))
}

// Get users with specific roles (array match for `other_roles`)
export async function getUsersByOtherRoles(role: string): Promise<User[]> {
    return db.select().from(users).where(sql`${role} = ANY(${users.other_roles})`);
}
