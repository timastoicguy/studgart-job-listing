import { Request, Response } from "express";

import mongoose from "mongoose";
import Job from "../models/jobs.models";
import { validationResult } from "express-validator";
import Company from "../models/Company";
import JobCategory from "../models/JobCategory";
import { Recruiter } from "../models/recruiter";

// CREATE a new Job
export const createJob = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }

    const newJob = new Job(req.body);
    await newJob.save();

    const jobDto = await newJob.populate([
      "company",
      "jobCategory",
      "recruiter",
    ]);

    return res.status(201).json({ error: null, data: jobDto });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

// GET all jobs with pagination and filtering
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-postedDate",
      search,
      company,
      category,
      requirements,
      location,
      experienceLevel,
      employmentType,
      minSalary,
      maxSalary,
      benefits,
      responsibilities,
      skills,
      technologies,
      employmentPosions,
    }: any = req.query;

    const filter: any = {};

    // Tìm kiếm chung
    if (search) {
      const regexSearch = new RegExp(search, "i");
      filter.$or = [
        { title: { $regex: regexSearch } },
        { description: { $regex: regexSearch } },
        { skills: { $regex: regexSearch } },
        { responsibilities: { $regex: regexSearch } },
        { requirements: { $regex: regexSearch } },
        {
          location: {
            $elemMatch: {
              $or: [
                { name: { $regex: regexSearch } },
                { code: { $regex: regexSearch } },
              ],
            },
          },
        },
        {
          technologies: {
            $elemMatch: {
              $or: [
                { name: { $regex: regexSearch } },
                { code: { $regex: regexSearch } },
              ],
            },
          },
        },
        { benefits: { $regex: regexSearch } },
        {
          employmentType: {
            $elemMatch: {
              $or: [
                { name: { $regex: regexSearch } },
                { code: { $regex: regexSearch } },
              ],
            },
          },
        },
        {
          employmentPosions: {
            $elemMatch: {
              $or: [
                { name: { $regex: regexSearch } },
                { code: { $regex: regexSearch } },
              ],
            },
          },
        },
        {
          experienceLevel: {
            $elemMatch: {
              $or: [
                { name: { $regex: regexSearch } },
                { code: { $regex: regexSearch } },
              ],
            },
          },
        },
      ];
    }

    // Kiểm tra và thêm lọc theo skills
    if (skills) {
      const skillCodes = skills.split(",").map((code: string) => code.trim());
      filter.skills = {
        $elemMatch: { $in: skillCodes },
      };
    }

    // Lọc theo company, nếu được cung cấp
    if (company) {
      if (mongoose.Types.ObjectId.isValid(company)) {
        filter.company = company; // Lọc theo company ID
      }
    }

    // Lọc theo category, nếu được cung cấp
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.jobCategory = category; // Lọc theo category ID
      }
    }

    // Lọc theo mã location
    if (location) {
      const locationCodes = location
        .split(",")
        .map((code: string) => code.trim());
      filter.location = { $elemMatch: { code: { $in: locationCodes } } };
    }

    // Kiểm tra và thêm lọc theo experienceLevel
    if (experienceLevel) {
      const experienceCodes = experienceLevel
        .split(",")
        .map((code: string) => code.trim());
      filter.experienceLevel = {
        $elemMatch: { code: { $in: experienceCodes } },
      };
    }

    // Kiểm tra và thêm lọc theo employmentType
    if (employmentType) {
      const employmentTypeCodes = employmentType
        .split(",")
        .map((code: string) => code.trim());
      filter.employmentType = {
        $elemMatch: { code: { $in: employmentTypeCodes } },
      };
    }

    // Kiểm tra và thêm lọc theo technologies
    if (technologies) {
      const technologyCodes = technologies
        .split(",")
        .map((code: string) => code.trim());
      filter.technologies = { $elemMatch: { code: { $in: technologyCodes } } };
    }

    // Kiểm tra và thêm lọc theo employmentPosions
    if (employmentPosions) {
      const positionCodes = employmentPosions
        .split(",")
        .map((code: string) => code.trim());
      filter.employmentPosions = {
        $elemMatch: { code: { $in: positionCodes } },
      };
    }

    // Lọc theo khoảng lương
    if (minSalary || maxSalary) {
      filter.salaryRange = {};
      if (minSalary) filter.salaryRange.min = { $gte: Number(minSalary) };
      if (maxSalary) filter.salaryRange.max = { $lte: Number(maxSalary) };
    }

    // Tìm kiếm theo tên công ty, loại công việc, và nhà tuyển dụng
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        const regexSearch = new RegExp(search, "i");
        const companyIds = await Company.find({
          company_name: { $regex: regexSearch },
        }).select("_id");
        const categoryIds = await JobCategory.find({
          name: { $regex: regexSearch },
        }).select("_id");

        if (companyIds.length > 0) {
          filter.company = { $in: companyIds.map((c) => c._id) };
        }
        if (categoryIds.length > 0) {
          filter.jobCategory = { $in: categoryIds.map((c) => c._id) };
        }
      }
    }

    // @ts-ignore
    // Cuối cùng, gọi paginate
    const paginatedJobs = await Job.paginate(filter, {
      page: Number(page),
      limit: Number(limit),
      sort: String(sort),
      populate: [
        { path: "company" },
        { path: "jobCategory" },
        { path: "recruiter" },
      ],
    });

    return res.status(200).json({ error: null, data: paginatedJobs });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Server Error", data: null });
  }
};

// GET a specific Job by ID or title
export const getJobByIdOrTitle = async (req: Request, res: Response) => {
  try {
    const { id_or_title } = req.params;
    let job;

    if (mongoose.Types.ObjectId.isValid(id_or_title)) {
      job = await Job.findById(id_or_title).populate([
        "company",
        "jobCategory",
        "recruiter",
      ]);
    } else {
      job = await Job.findOne({ title: id_or_title }).populate([
        "company",
        "jobCategory",
        "recruiter",
      ]);
    }

    if (!job)
      return res.status(404).json({ error: "Job not found", data: null });

    return res.status(200).json({ error: null, data: job });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};

// UPDATE a job by ID
export const updateJobById = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }

    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate(["company", "jobCategory", "recruiter"]);

    if (!updatedJob)
      return res.status(404).json({ error: "Job not found", data: null });

    return res.status(200).json({ error: null, data: updatedJob });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};

// DELETE a job by ID
export const deleteJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob)
      return res.status(404).json({ error: "Job not found", data: null });

    return res.status(200).json({ error: null, data: deletedJob });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};
