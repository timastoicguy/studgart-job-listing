import { Request, Response } from "express";
import Application from "../models/aplication.model";
import mongoose from "mongoose";

// Create a new application
export const createApplication = async (req: Request, res: Response) => {
  try {
    // Tạo một bản ghi Application mới
    const application = new Application(req.body);
    // Lưu application vào cơ sở dữ liệu
    await application.save();

    // Sau khi lưu, sử dụng populate để lấy các thông tin chi tiết từ các bảng liên quan
    const populatedApplication = await application.populate([
      { path: "job_id" },
      { path: "job_seeker_id" },
      { path: "job_reviewer_id" },
    ]);
    res.status(201).json({
      error: null,
      data: populatedApplication,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      data: null,
    });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    application_status_sort = "desc",
    applied_at_sort = "desc",
    application_status,
    job_reviewer_id,
    job_seeker_id,
    job_id,
    applied_at,
  } = req.query;

  // Tạo object để lưu các điều kiện lọc
  const filters: any = {};

  // Lọc theo application_status nếu có
  if (application_status) {
    filters.application_status = application_status;
  }

  // Kiểm tra xem job_reviewer_id có phải ObjectId hợp lệ không
  if (
    job_reviewer_id &&
    mongoose.Types.ObjectId.isValid(job_reviewer_id as string)
  ) {
    filters.job_reviewer_id = job_reviewer_id;
  }

  // Kiểm tra xem job_seeker_id có phải ObjectId hợp lệ không
  if (
    job_seeker_id &&
    mongoose.Types.ObjectId.isValid(job_seeker_id as string)
  ) {
    filters.job_seeker_id = job_seeker_id;
  }

  // Kiểm tra xem job_id có phải ObjectId hợp lệ không
  if (job_id && mongoose.Types.ObjectId.isValid(job_id as string)) {
    filters.job_id = job_id;
  }

  // Kiểm tra xem applied_at có phải ngày hợp lệ không
  if (applied_at && !isNaN(Date.parse(applied_at as string))) {
    filters.applied_at = {
      $gte: new Date(applied_at as string),
      $lte: new Date(new Date(applied_at as string).setHours(23, 59, 59, 999)), // Tìm theo ngày chính xác
    };
  }

  // Tạo options cho phân trang và sắp xếp
  const options: any = {
    page: Number(page),
    limit: Number(limit),
    sort: {},
    populate: [
      { path: "job_id" }, // Lấy thông tin của job
      { path: "job_seeker_id" }, // Lấy thông tin của job seeker
      { path: "job_reviewer_id" }, // Lấy thông tin của recruiter
    ],
  };

  // Sắp xếp theo application_status
  if (application_status_sort) {
    options.sort["application_status"] =
      application_status_sort === "desc" ? -1 : 1;
  }

  // Sắp xếp theo applied_at
  if (applied_at_sort) {
    options.sort["applied_at"] = applied_at_sort === "desc" ? -1 : 1;
  }

  try {
    // Lấy dữ liệu phân trang và lọc
    // @ts-ignore
    const applications = await Application.paginate(filters, options);

    res.status(200).json({
      error: null,
      data: applications,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      data: null,
    });
  }
};

// Get an application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id).populate([
      { path: "job_id" },
      { path: "job_seeker_id" },
      { path: "job_reviewer_id" },
    ]);
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        data: null,
      });
    }
    res.status(200).json({
      error: null,
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      data: null,
    });
  }
};

// Update an application by ID
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        data: null,
      });
    }
    res.status(200).json({
      error: null,
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      data: null,
    });
  }
};

// Delete an application by ID
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        data: null,
      });
    }
    res.status(200).json({
      error: null,
      data: "Application deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
      data: null,
    });
  }
};
