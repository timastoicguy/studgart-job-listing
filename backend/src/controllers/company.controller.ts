import { Request, Response } from "express";
import Company, { ICompany } from "../models/Company";
import { ICompanyDTO } from "../dto/ICompanyDTO";

export const toCompanyDTO = (company: ICompany): ICompanyDTO => ({
  _id: company._id as string,
  company_size: company.company_size,
  profile_summary: company.profile_summary,
  company_history: company.company_history,
  company_name: company.company_name,
  company_description: company.company_description,
  company_website: company.company_website,
  company_logo: company.company_logo,
  contact_email: company.contact_email,
  contact_phone: company.contact_phone,
  company_address: company.company_address,
  industry: company.industry,
  established_year: company.established_year,
  social_links: company.social_links,
  tax_number: company.tax_number,
});

// Create a new company
export const createCompany = async (req: Request, res: Response) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    return res.json({ error: null, data: savedCompany });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Get a company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id).populate("user_id");
    if (!company) {
      return res.status(404).json({ error: "Company not found", data: null });
    }
    return res.json({ error: null, data: company });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Update a company by ID
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found", data: null });
    }
    return res.json({ error: null, data: updatedCompany });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Delete a company by ID
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found", data: null });
    }
    return res.json({ error: null, data: deletedCompany });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};

// Get all companies with pagination
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const query: any = {};

    // Tìm kiếm theo tên công ty nếu có
    if (name) {
      query["company_name"] = { $regex: name, $options: "i" };
    }

    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };
    // @ts-ignore
    const companies = await Company.paginate(query, options);
    return res.json({ error: null, data: companies });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", data: null });
  }
};
