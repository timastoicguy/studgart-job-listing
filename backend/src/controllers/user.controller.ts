import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { IUserDTO } from "../dto/user.dto";
import { PaginateResult } from "mongoose";

// Convert User Document to UserDTO
export const toUserDTO = (user: IUser): IUserDTO => ({
  _id: user._id as string,
  username: user.username,
  email: user.email,
  phone: user.phone,
  fullName: user.fullName,
  role: user.role,
  profilePicture: user.profilePicture,
  address: user.address,
  bio: user.bio,
  lastLogin: user.lastLogin,
  isActive: user.isActive,
  isVerified: user.isVerified,
});

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ error: null, data: toUserDTO(user) });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

// Get Users with pagination and query
export const getUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, username, email, fullName, role } = req.query;

  const query: any = {};
  if (username) query.username = new RegExp(username as string, "i");
  if (email) query.email = new RegExp(email as string, "i");
  if (fullName) query.fullName = new RegExp(fullName as string, "i");
  if (role) query.role = role;

  const options = {
    page: Number(page),
    limit: Number(limit),
    select: "-passwordHash", // Exclude passwordHash field from response
  };

  try {
    // Execute query
    // @ts-ignore
    const users: PaginateResult<IUser> = await User.paginate(query, options);
    const usersDTO = users.docs.map((user) => toUserDTO(user));
    return res.status(200).json({
      error: null,
      data: {
        users: usersDTO,
        totalDocs: users.totalDocs,
        totalPages: users.totalPages,
        page: users.page,
        limit: users.limit,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }
    return res.status(200).json({ error: null, data: toUserDTO(user) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }
    return res.status(200).json({ error: null, data: toUserDTO(user) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }
    return res
      .status(200)
      .json({ error: null, data: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};
