import bcrypt from "bcrypt";
import { UserModel } from "./auth.model";
import config from "../../config";

export const seedSuperAdmin = async () => {
    try {
        const superAdminExists = await UserModel.findOne({ role: "superadmin" });

        if (!superAdminExists) {
            const hashedPassword = await bcrypt.hash(config.superAdminPassword as string, Number(config.bcrypt_salt_rounds));

            const superAdmin = {
                fullName: "Super Admin",
                email: config.superAdminEmail,
                password: hashedPassword,
                role: "superadmin",
                username: "superadmin",
                location: "Headquarters",
                isActive: true,
                isEmailVerified: true,
                isDeleted: false,
                isDeactivated: false,
            };

            await UserModel.create(superAdmin);
            console.log("✅ Super Admin created successfully:", config.superAdminEmail);
        } else {
            console.log("ℹ️ Super Admin already exists");
        }
    } catch (error) {
        console.error("Error seeding super admin:", error);
    }
};
