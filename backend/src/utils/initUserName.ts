import { supabaseAdmin } from "../config/supabase.config.js";
import prisma from "../config/prisma.config.js";
import { generateRandomName } from "../utils/genrandom.username.js";

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

    const newUser = await prisma.profile.create({
        data: {
            authId,         // Supabase Auth UUID
            username: finalUsername,
            email,
        },
    });

    return newUser.username;
};
