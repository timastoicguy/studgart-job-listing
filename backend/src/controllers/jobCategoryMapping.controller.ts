import { Request, Response } from "express";
import JobCategoryMapping from "../models/JobCategoryMapping";

// Create a new job category mapping
export const createJobCategoryMapping = async (req: Request, res: Response) => {
  try {
    const newMapping = new JobCategoryMapping(req.body);
    const savedMapping = await newMapping.save();
    return res.json({ error: null, data: savedMapping });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Get job category mappings with pagination
export const getJobCategoryMappings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      populate: ["job_id", "category_id"],
    };
    // @ts-ignore
    const mappings = await JobCategoryMapping.paginate({}, options);
    return res.json({ error: null, data: mappings });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Delete a job category mapping by job_id and category_id
export const deleteJobCategoryMapping = async (req: Request, res: Response) => {
  try {
    const { job_id, category_id } = req.params;
    const deletedMapping = await JobCategoryMapping.findOneAndDelete({
      job_id,
      category_id,
    });
    if (!deletedMapping) {
      return res
        .status(404)
        .json({ error: "Job category mapping not found", data: null });
    }
    return res.json({ error: null, data: deletedMapping });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};
