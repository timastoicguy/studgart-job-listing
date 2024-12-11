import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi'
import { Navigate, useNavigate } from 'react-router-dom'

import useAuthStore from '@/stores/authStore'

function AddResume() {

    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const onCreate = async () => {
        setLoading(true)
        const uuid = uuidv4();
        const
            data = {
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.email,
                userName: user?.username
            }


        GlobalApi.CreateNewResume(data).then(resp => {
            if (resp) {
                setLoading(false);
                navigation('/dashboard/resume/' + resp.data.data.resumeId + "/edit");
            }
        }, (error) => {
            setLoading(false);
        })

    }
    return (
        <div >
            <div className='p-14 py-24 border 
        items-center flex 
        justify-center bg-secondary
        rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo CV mới</DialogTitle>
                        <DialogDescription>
                            <p>Thêm tiêu đề cho CV mới của bạn</p>
                            <Input className="my-2"
                                placeholder="Ex.Full Stack resume"
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Hủy</Button>
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={() => onCreate()}>
                                {loading ?
                                    <Loader2 className='animate-spin' /> : 'Tạo'
                                }
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddResume