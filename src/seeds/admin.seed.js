import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AuthenticatedUserModel } from "../models/auth/authenticated-user.model.js";
import { UserModel } from "../models/auth/user.model.js";
import { Book } from "../models/book.model.js";
import { mongoDBService } from "../services/mongodb.services.js";
import { UserRoleEnum, UserStatusEnum } from "../constants.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/books.json"), "utf-8"),
);

const seedAdminAndBooks = async () => {
  try {
    await mongoDBService.connect();
    
    // Create admin user
    const adminEmail = "admin@booklibrary.com";
    const adminPassword = "AdminPassword123!";
    
    let adminAuth = await AuthenticatedUserModel.findOne({ email: adminEmail });
    if (!adminAuth) {
      adminAuth = new AuthenticatedUserModel({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        role: UserRoleEnum.ADMIN,
        verified: true,
        status: UserStatusEnum.ACTIVE,
      });
      await adminAuth.save();
      
      const user = new UserModel({
        authUserId: adminAuth._id,
        name: "Admin User",
        email: adminEmail,
        avatar: "https://ui-avatars.com/api/?name=Admin+User",
      });
      await user.save();
      console.log("✅ Admin user created.");
    } else {
      console.log("ℹ️ Admin user already exists.");
      // Just to ensure password is known to log in:
      adminAuth.password = adminPassword;
      await adminAuth.save();
      console.log("✅ Admin user password reset successfully.");
    }
    
    // Check if books already exist
    const existingBooks = await Book.countDocuments();
    if (existingBooks > 0) {
      console.log(`ℹ️ Books already exist (${existingBooks} found). Skipping book seed.`);
    } else {
      // Insert all books
      await Book.insertMany(booksData);
      console.log(`✅ ${booksData.length} books added successfully.`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY 🎉");
    console.log("=".repeat(50));
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("=".repeat(50) + "\n");

    // Close db connection if running as a standalone script
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdminAndBooks();
