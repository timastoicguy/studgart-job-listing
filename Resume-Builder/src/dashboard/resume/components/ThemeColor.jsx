import React, { useContext, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function ThemeColor() {
  const colors = [
    "#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", // Tông xanh và cam đất
    "#1B263B", "#415A77", "#778DA9", "#E0E1DD", "#F4F1DE", // Tông xanh dương trung tính
    "#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429", // Tông đỏ và xám nhạt
    "#283618", "#606C38", "#DDA15E", "#BC6C25", "#F2E8CF"  // Tông xanh lá và vàng nhạt
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState();
  const { resumeId } = useParams();
  const onColorSelect = (color) => {
    setSelectedColor(color)
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    });
    const data = {
      themeColor: color
    }
    GlobalApi.UpdateResumeDetail(resumeId, data).then(resp => {
      console.log(resp);
      toast('Theme Color Updated')
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"
          className="flex gap-2" > <LayoutGrid /> Theme</Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className='mb-2 text-sm font-bold'>Select Theme Color</h2>
        <div className='grid grid-cols-5 gap-3'>
          {colors.map((item, index) => (
            <div
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${selectedColor == item && 'border border-black'}
             `}
              style={{
                background: item
              }}>

            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeColor