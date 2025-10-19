import { supabaseAdmin } from "../config/supabase.config.js";
import prisma from "../config/prisma.config.js";
import { generateRandomName } from "../utils/genrandom.username.js";
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
    const email = authUser.email ?? "";

    const finalUsername = displayName || generateRandomName();

    try {
        const newUser = await prisma.profile.create({
            data: {
                authId,
                username: finalUsername,
                email,
            },
        });
        return newUser.username;
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
            // Handle duplicate record safely
            const existingProfile = await prisma.profile.findUnique({
                where: { authId },
                select: { username: true },
            });

            if (existingProfile?.username) {
                return existingProfile.username;
            } else {
                console.warn("P2002 occurred but existing profile not found for:", authId);
                throw new Error("Unexpected state: user profile not found after P2002");
            }
        }

        throw e;
    }
};
