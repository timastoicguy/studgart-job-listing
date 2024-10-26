export interface ICompanyDTO {
  _id: string;
  company_size: string;
  profile_summary: string;
  company_history: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_logo?: string;
  contact_email: string;
  contact_phone: string;
  company_address: string;
  industry: string;
  established_year: number;
  social_links: object;
  tax_number: string;
}
