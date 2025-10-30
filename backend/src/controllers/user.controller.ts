import type { Request, Response } from "express";
import prisma from "../config/prisma.config.js";
import { initUserNameByAuthId } from "../utils/initUserName.js";
import { supabaseAdmin } from "../config/supabase.config.js"; // <-- Import Supabase Admin

// Helper to get the logged-in user's Auth ID
const getId = (req: Request, res: Response): string | null => {
    const id = (req.user as any)?.sub;
    if (!id) {
        console.error("Missing authId in request context");
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }
    return id;
};

const getUserInfo = async (req: Request, res: Response) => {
    console.log("getUserInfo");

    try {
        const authId = getId(req, res);
        if (!authId) return; // Already handled unauthorized case

        const profile = await prisma.profile.findUnique({
            where: { authId },
            select: { username: true },
        });

        if (!profile) {
            console.log("Profile not found — creating new one");
            const username = await initUserNameByAuthId(authId);
            return res.status(200).json({
                namePresent: false,
                username,
            });
        }

        return res.status(200).json({
            namePresent: true,
            username: profile.username,
        });

    } catch (error) {
        console.error("Error in getUserInfo:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUserInfo = async (req: Request, res: Response) => {
    console.log("updateUserInfo");

    try {
        const authId = getId(req, res);
        if (!authId) return; 

        const { username } = req.body;
        if (!username || typeof username !== "string" || username.trim().length < 3) {
            return res.status(400).json({ error: "Invalid username" });
        }

        const existingProfile = await prisma.profile.findUnique({ where: { authId } });
        if (!existingProfile) {
            console.error("Profile not found for this user");
            return res.status(404).json({ error: "Profile not found" });
        }

        // --- START: Update Supabase Auth User ---
        // We do this in a separate try/catch so a failure here doesn't
        // prevent the local profile from being updated.
        try {
          // 1. Get the current auth user to preserve any existing metadata
          const { data: authUserData, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(authId);
          
          if (authUserError) {
            throw new Error(`Failed to fetch auth user: ${authUserError.message}`);
          }

          const existingMetadata = authUserData.user.user_metadata || {};

          // 2. Update the user's metadata in Supabase Auth
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            authId,
            {
              // Merge existing metadata with the new display_name
              user_metadata: { ...existingMetadata, display_name: username }
            }
          );

          if (updateError) {
            throw new Error(`Failed to update Supabase Auth user: ${updateError.message}`);
          }
          
          console.log(`Successfully updated display_name for authId: ${authId}`);

        } catch (authUpdateError: any) {
          // Log the error but don't block the main profile update
          console.error("Error updating Supabase Auth user metadata:", authUpdateError.message);
        }
        // --- END: Update Supabase Auth User ---

        // Continue to update the local Prisma Profile table
        const updatedProfile = await prisma.profile.update({
            where: { authId },
            data: { username },
            select: { id: true, username: true, email: true, updatedAt: true },
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile,
        });

    } catch (error: any) {
        console.error("Error in updateUserInfo:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export { getUserInfo, updateUserInfo };
