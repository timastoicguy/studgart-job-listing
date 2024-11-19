import axios from "axios";

// Định nghĩa kiểu dữ liệu cho một công ty
export interface Company {
  _id: string;
  company_name: string;
  company_size: string;
  contact_email: string;
  contact_phone: string;
  company_address: string;
  tax_number: string;
}

// Định nghĩa cấu trúc dữ liệu trả về từ API
interface FetchRecommendedCompaniesResponse {
  error: null | string;
  data: Array<{ company: Company }>; // Mảng các công ty từ dữ liệu trả về
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Hàm gọi API để lấy danh sách công ty được gợi ý
export async function fetchRecommendedCompanies(): Promise<FetchRecommendedCompaniesResponse | null> {
  try {
    const userData = localStorage.getItem("userData");
    const userId = userData ? JSON.parse(userData).id : null;
    // Gửi yêu cầu GET đến backend để lấy dữ liệu công ty
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recruiters?page=1&limit=10&user_id=${userId}`);

    // Dữ liệu trả về đã được Axios tự động parse, bạn có thể trực tiếp sử dụng response.data
    const data: FetchRecommendedCompaniesResponse = response.data;

    console.log("Fetched Data:", data); // In ra dữ liệu lấy được

    // Kiểm tra nếu dữ liệu đúng với cấu trúc mong muốn
    if (data && Array.isArray(data.data)) {
      return data; // Trả về dữ liệu nếu cấu trúc hợp lệ
    } else {
      console.error("Unexpected response structure:", data); // Log lỗi nếu cấu trúc không hợp lệ
      return null;
    }
  } catch (error) {
    console.error("Error fetching recommended companies:", error); // Log lỗi khi gọi API thất bại
    return null;
  }
}
