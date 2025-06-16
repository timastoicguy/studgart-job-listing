import axios from "axios";


const API_KEY = localStorage.getItem('accessToken');
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/api/",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
})

const GetSummaryAIForCV = (data) => axiosClient.post('/gen-summary-api', data);
const GetExperienceAIForCV = (data) => axiosClient.post('/gen-experience-api', data);
export default {
  GetSummaryAIForCV,
  GetExperienceAIForCV
}