import { toRecruiterDTO } from "../controllers/recruiter.controller";
import { IRecruiter, Recruiter } from "../models/recruiter";

export const createRecruiter = async (recruiterData: any) => {
  const recruiter = new Recruiter(recruiterData);
  await recruiter.save();
  try {
    const savedRecruiter = await recruiter.save();
    const populatedRecruiter = await savedRecruiter.populate([
      "user_id",
      "company_id",
    ]);
    return toRecruiterDTO(populatedRecruiter as IRecruiter);
  } catch (error: any) {
    throw new Error(`Error creating recruiter: ${error.message}`);
  }
};

export const getRecruiters = async (
  page: number,
  limit: number,
  status?: string,
  company_id?: string,
  user_id?: string
) => {
  const query: any = {};
  if (status) query.status = status;
  if (company_id) query.company_id = company_id;
  if (user_id) query.user_id = user_id;

  const options = {
    page,
    limit,
    populate: ["user_id", "company_id"],
    lean: true,
  };
  // @ts-ignore
  const result = await Recruiter.paginate(query, options);

  return {
    recruiters: result.docs.map((recruiter: any) => toRecruiterDTO(recruiter)),
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
    currentPage: result.page,
  };
};

export const getRecruiterById = async (id: string) => {
  const recruiter = await Recruiter.findById(id)
    .populate("user_id")
    .populate("company_id")
    .exec();

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  return toRecruiterDTO(recruiter as IRecruiter);
};

export const updateRecruiter = async (id: string, recruiterData: any) => {
  const recruiter = await Recruiter.findByIdAndUpdate(id, recruiterData, {
    new: true,
  })
    .populate("user_id")
    .populate("company_id")
    .exec();

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  return toRecruiterDTO(recruiter as IRecruiter);
};

export const deleteRecruiter = async (id: string) => {
  const recruiter = await Recruiter.findByIdAndDelete(id);
  if (!recruiter) {
    throw new Error("Recruiter not found");
  }
};
