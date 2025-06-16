import { Request, Response } from "express";
import JobCategory from "../models/JobCategory";

// Create a new job category
export const createJobCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new JobCategory(req.body);
    const savedCategory = await newCategory.save();
    return res.json({ error: null, data: savedCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Get a job category by ID
export const getJobCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await JobCategory.findById(req.params.id).populate(
      "parent_category_id"
    );
    if (!category) {
      return res
        .status(404)
        .json({ error: "Job category not found", data: null });
    }
    return res.json({ error: null, data: category });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Update a job category by ID
export const updateJobCategory = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ error: "Job category not found", data: null });
    }
    return res.json({ error: null, data: updatedCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Delete a job category by ID
export const deleteJobCategory = async (req: Request, res: Response) => {
  try {
    const deletedCategory = await JobCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ error: "Job category not found", data: null });
    }
    return res.json({ error: null, data: deletedCategory });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Get all job categories with pagination
export const getJobCategories = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      populate: "parent_category_id",
    };
    // @ts-ignore
    const categories = await JobCategory.paginate({}, options);
    return res.json({ error: null, data: categories });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};
