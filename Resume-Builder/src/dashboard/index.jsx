import { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import useAuthStore from '@/stores/authStore';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import FloatingButton from '@/components/custom/FloatingButton';
function Dashboard() {

  const { user } = useAuthStore();
  const [resumeList, setResumeList] = useState([]);
  useEffect(() => {
    user && GetResumesList()
  }, [user])

  /**
   * Used to Get Users Resume List
   */
  const GetResumesList = () => {
    GlobalApi.GetUserResumes(user?.email)
      .then(resp => {
        console.log(resp.data.data)
        setResumeList(resp.data.data);
      })
  }
  return (
    <>
      <div className='p-10 md:px-20 lg:px-32'>
        <h2 className='font-bold text-3xl'>CV của tôi</h2>
        <p>Bắt đầu tạo CV theo công việc của bạn</p>
        <div className='grid grid-cols-2 
      md:grid-cols-3 lg:grid-cols-5 gap-5
      mt-10
      '>
          <AddResume />
          {resumeList.length > 0 ? resumeList.map((resume) => (
            <ResumeCardItem resume={resume} key={resume._id} refreshData={GetResumesList} />
          )) :
            [1, 2, 3, 4].map((item, index) => (
              <div key={index} className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
              </div>
            ))
          }
        </div>
      </div>
      <FloatingButton />
    </>

  )
}

export default Dashboard