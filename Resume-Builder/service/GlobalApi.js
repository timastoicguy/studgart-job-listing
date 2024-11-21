import axios from "axios";


const API_KEY = localStorage.getItem('accessToken');
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API + "/api/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
})


const CreateNewResume = (data) => axiosClient.post('/user-resumes', data);

const GetUserResumes = (userEmail) => axiosClient.get('/user-resumes?email=' + userEmail);

const UpdateResumeDetail = (id, data) => axiosClient.put('/user-resumes/' + id, data)

const GetResumeById = (id) => axiosClient.get('/user-resumes/' + id + "?populate=*")

const DeleteResumeById = (id) => axiosClient.delete('/user-resumes/' + id)


export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById
}