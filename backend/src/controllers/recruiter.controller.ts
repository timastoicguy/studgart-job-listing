import { IRecruiterDTO } from "../dto/IRecruiterDTO";
import { IRecruiter } from "../models/recruiter";
import {
  createRecruiter,
  deleteRecruiter,
  getRecruiterById,
  getRecruiters,
  updateRecruiter,
} from "../services/recruiterService";
import { toCompanyDTO } from "./company.controller";
import { toUserDTO } from "./user.controller";
import { Request, Response } from "express";
export const toRecruiterDTO = (recruiter: IRecruiter): IRecruiterDTO => ({
  _id: recruiter._id as string,
  status: recruiter.status,
  created_at: recruiter.created_at,
  user: toUserDTO(recruiter.user_id as any),
  company: toCompanyDTO(recruiter.company_id as any),
});

/**
 * Create a new recruiter
 */
export const createRecruiterController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiter = await createRecruiter(req.body);
    return res.status(201).json({
      error: null,
      data: recruiter,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message,
      data: null,
    });
  }
};

/**
 * Get all recruiters with pagination and filters for status, company_id, and user_id
 */
export const getRecruitersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { status, company_id, user_id } = req.query;

    const recruiters = await getRecruiters(
      page,
      limit,
      status as string,
      company_id as string,
      user_id as string
    );

    return res.status(200).json({
      error: null,
      data: recruiters.recruiters,
      totalPages: recruiters.totalPages,
      totalDocs: recruiters.totalDocs,
      currentPage: recruiters.currentPage,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message,
      data: null,
    });
  }
};

/**
 * Get a single recruiter by ID
 */
export const getRecruiterByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiter = await getRecruiterById(req.params.id);
    return res.status(200).json({
      error: null,
      data: recruiter,
    });
  } catch (error: any) {
    return res.status(404).json({
      error: error?.message,
      data: null,
    });
  }
};

/**
 * Update a recruiter by ID
 */
export const updateRecruiterController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiter = await updateRecruiter(req.params.id, req.body);
    return res.status(200).json({
      error: null,
      data: recruiter,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message,
      data: null,
    });
  }
};

/**
 * Delete a recruiter by ID
 */
export const deleteRecruiterController = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteRecruiter(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message,
      data: null,
    });
  }
};
