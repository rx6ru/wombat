import { supabaseAdmin } from "../config/supabase.config.js";
import prisma from "../config/prisma.config.js";
import { generateRandomName } from "../utils/genrandom.username.js";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const initUserNameByAuthId = async (authId: string) => {

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(authId);
    if (error || !data?.user) {
        console.error("Error fetching Supabase Auth user:", error);
        throw new Error("Failed to fetch Supabase Auth user");
    }

    const authUser = data.user;

    const displayName =
        authUser.user_metadata?.display_name ||
        authUser.user_metadata?.full_name ||
        null;
    const email = authUser.email ?? null;

    const finalUsername = displayName || generateRandomName();

    try {
        const newUser = await prisma.profile.create({
            data: {
                authId,         // Supabase Auth UUID
                username: finalUsername,
                email,
            },
        });
        return newUser.username;
    } catch (e) {
        
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
            // Race condition: Profile was created between the check in the controller and this create call.
            // Safely fetch and return the existing profile.
            const existingProfile = await prisma.profile.findUnique({
                where: { authId },
                select: { username: true },
            });
            return existingProfile!.username; // We can assert non-null because the P2002 error proves it exists.
        }
        // Re-throw any other errors.
        throw e;
    }
};
