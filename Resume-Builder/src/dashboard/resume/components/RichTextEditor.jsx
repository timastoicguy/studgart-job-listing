import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnUnderline, Editor, EditorProvider, Separator, Toolbar } from 'react-simple-wysiwyg'
import AIApi from './../../../../service/AIModal';
import { toast } from 'sonner';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue, handleExperienceDeatail }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false);
  const GenerateSummeryFromAI = async () => {

    if (!resumeInfo?.experience[index]?.title) {
      toast('Please Add Position Title');
      return;
    }
    setLoading(true)

    const payload = {
      jobTitle: resumeInfo?.experience[index]?.title,
      firstName: resumeInfo?.firstName,
      lastName: resumeInfo?.lastName,
    }
    if (!payload?.firstName || !payload?.lastName || !payload?.jobTitle) {
      toast.error('Please Add First Name, Last Name and Job Title');
      return
    }
    try {
      const result = await AIApi.GetExperienceAIForCV(payload);

      setValue(result?.data?.data?.experienceDetails);
      handleExperienceDeatail(result?.data?.data?.experienceDetails, 'workSummery', index)
      setLoading(false);
    } catch (error) {
      toast.error("Server Error, Please try again!");
      setLoading(false);
    }

  }

  const onChange = (e) => {
    setValue(e.target.value);
    onRichTextEditorChange(e)
  }

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summery</label>
        <Button variant="outline" size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary">
          {loading ?
            <LoaderCircle className='animate-spin' /> :
            <>
              <Brain className='h-4 w-4' /> Generate from AI
            </>
          }
        </Button>
      </div>
      <EditorProvider>
        <Editor value={value} onChange={onChange}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />


          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}

export default RichTextEditor