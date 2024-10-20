import { Request, Response } from "express";
import JobSeeker, { IJobSeeker } from "../models/jobSeeker.model";
import { IJobSeekerDTO } from "../dto/jobSeeker.dto";
import { toUserDTO } from "./user.controller";

export const toJobSeekerDTO = (jobSeeker: IJobSeeker): IJobSeekerDTO => {
  return {
    _id: jobSeeker._id as string,
    user: toUserDTO(jobSeeker.user_id as any),
    resume: jobSeeker.resume,
    experience: jobSeeker.experience,
    education: jobSeeker.education,
    skills: jobSeeker.skills,
    linkedin_profile: jobSeeker.linkedin_profile,
    portfolio_url: jobSeeker.portfolio_url,
    desired_salary: jobSeeker.desired_salary,
    availability: jobSeeker.availability,
    languages: jobSeeker.languages,
    certifications: jobSeeker.certifications || [],
    created_at: jobSeeker.created_at,
  };
};

export const createJobSeeker = async (req: Request, res: Response) => {
  try {
    const jobSeeker = new JobSeeker(req.body);
    await jobSeeker.save();

    const jobSeekerDto = await jobSeeker.populate("user_id");

    console.log(jobSeekerDto);
    return res
      .status(201)
      .json({ error: null, data: toJobSeekerDTO(jobSeekerDto) });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

export const getJobSeekers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, user_id } = req.query;

  try {
    const options = {
      page: Number(page),
      limit: Number(limit),
      populate: "user_id",
      lean: true,
    };

    const query = user_id ? { user_id } : {};
    // @ts-ignore
    const result = await JobSeeker.paginate(query, options);

    const jobSeekersDTO = {
      jobSeekers: result.docs.map((jobSeeker: any) =>
        toJobSeekerDTO(jobSeeker)
      ),
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
      currentPage: result.page,
    };

    return res.status(200).json({ error: null, data: jobSeekersDTO });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

export const getJobSeekerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const jobSeeker = await JobSeeker.findById(id).populate("user_id").exec();
    if (!jobSeeker) {
      return res
        .status(404)
        .json({ error: "Job seeker not found", data: null });
    }
    return res
      .status(200)
      .json({ error: null, data: toJobSeekerDTO(jobSeeker) });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

export const updateJobSeeker = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const jobSeeker = await JobSeeker.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("user_id")
      .exec();
    if (!jobSeeker) {
      return res
        .status(404)
        .json({ error: "Job seeker not found", data: null });
    }
    return res
      .status(200)
      .json({ error: null, data: toJobSeekerDTO(jobSeeker) });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};

export const deleteJobSeeker = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const jobSeeker = await JobSeeker.findByIdAndDelete(id);
    if (!jobSeeker) {
      return res
        .status(404)
        .json({ error: "Job seeker not found", data: null });
    }
    return res
      .status(200)
      .json({ error: null, data: "Job seeker deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
};
