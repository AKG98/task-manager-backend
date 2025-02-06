import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";
import mongoose from "mongoose";

interface IRequestUser extends Request {
    user?: {
        _id: mongoose.Types.ObjectId;
    };
}

export const authenticate = async (
    req: IRequestUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.access_token;
        
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token no found"
            });
            return; // Added return statement
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
        };

        const user = await UserModel.findById(decoded.id).select("-password");
        
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found"
            });
            return; // Added return statement
        }

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
        return;
    }
};