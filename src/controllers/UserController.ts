import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Type definition for the User
type User = {
    name?: string;   // Name is optional
    email: string;
    password: string;
};

// Define the request user (could be from JWT or session)
interface IRequestUser extends Request {
    user?: { _id: string }; // Define the shape of req.user, assuming user has _id
}

export async function createUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        const { name, email, password }: User = req.body;

        // Check if the user already exists
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user and save to DB
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        // Respond with success
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
        } else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export async function loginUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        const { email, password }: User = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(409).json({ success: false, message: "User Not Found" });
            return;
        }

        // Compare the password with the stored hash
        const validUser = await bcryptjs.compare(password, user.password);
        if (!validUser) {
            res.status(409).json({ success: false, message: "Invalid Credentials" });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "24h" });

        // Send the token as a cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }).status(201).json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getCurrentUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        res.status(200).json({ success: true, message: "User found", data: req.user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function logoutUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        // Clear the cookie
        res.clearCookie("access_token").status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");
        if(updatedUser){
            res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
        }else{
            res.status(404).json({ success: false, message: "User not found" });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteUser(req: IRequestUser, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }

        const deletedUser = await UserModel.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
