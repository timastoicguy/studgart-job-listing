// controllers/favoriteController.js
import { Request, Response } from "express";
import Favorite from "../models/favorite.model";
import mongoose from "mongoose";

// Create a new favorite
export const createFavorite = async (req: Request, res: Response) => {
  try {
    const { job_id, job_seeker_id, status } = req.body;
    const favorite = new Favorite({ job_id, job_seeker_id, status });
    await favorite.save();

    return res.status(201).json({ error: null, data: favorite });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Server Error", data: null });
  }
};

// Get all favorites with pagination and filtering
export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, job_seeker_id, job_id }: any = req.query;

    const filter: any = {
      status: "saved",
    };
    if (job_seeker_id) {
      if (mongoose.Types.ObjectId.isValid(job_seeker_id)) {
        filter.job_seeker_id = job_seeker_id; // Filter by job_seeker_id
      }
    }

    if (job_id) {
      if (mongoose.Types.ObjectId.isValid(job_id)) {
        filter.job_id = job_id; // Filter by job_id
      }
    }

    // @ts-ignore
    // @ts-ignore
    const paginatedFavorites = await Favorite.paginate(filter, {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: -1 },
      populate: {
        path: "job_id",
      },
    });

    return res.status(200).json({ error: null, data: paginatedFavorites });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Server Error", data: null });
  }
};

// Update a favorite by ID
export const updateFavorite = async (req: Request, res: Response) => {
  try {
    const { job_id, job_seeker_id } = req.params; // Assuming job_id and job_seeker_id are passed in params
    const updates = req.body;

    const updatedFavorite = await Favorite.findOneAndUpdate(
      { job_id, job_seeker_id }, // Find by both job_id and job_seeker_id
      updates,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate against schema
      }
    );

    if (!updatedFavorite) {
      return res.status(404).json({ error: "Favorite not found", data: null });
    }

    return res.status(200).json({ error: null, data: updatedFavorite });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Server Error", data: null });
  }
};

// Delete a favorite by ID
export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { job_id, job_seeker_id } = req.params; // Assuming job_id and job_seeker_id are passed in params

    const deletedFavorite = await Favorite.findOneAndDelete(
      { job_id, job_seeker_id } // Find by both job_id and job_seeker_id
    );

    if (!deletedFavorite) {
      return res.status(404).json({ error: "Favorite not found", data: null });
    }

    return res.status(204).json({ error: null, data: null }); // No content
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Server Error", data: null });
  }
};
