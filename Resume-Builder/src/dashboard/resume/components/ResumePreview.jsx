/* eslint-disable react/prop-types */
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'

// function ResumePreview({ targetRef }) {

//     const { resumeInfo } = useContext(ResumeInfoContext)

//     return (
//         <div ref={targetRef} className='shadow-lg h-full p-14 border-t-[20px]'
//             style={{
//                 borderColor: resumeInfo?.themeColor
//             }}>
//             {/* Personal Detail  */}
//             <PersonalDetailPreview resumeInfo={resumeInfo} />
//             {/* Summery  */}
//             <SummeryPreview resumeInfo={resumeInfo} />
//             {/* Professional Experience  */}
//             {resumeInfo?.experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
//             {/* Educational  */}
//             {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
//             {/* Skilss  */}
//             {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
//         </div>
//     )
// }

// export default ResumePreview



function ResumePreview({ targetRef }) {
    const { resumeInfo } = useContext(ResumeInfoContext);

    return (
        <div
            ref={targetRef}
            className="shadow-lg w-[794px] h-full py-10 border-t-[20px] px-5 mx-auto"
            style={{
                borderColor: resumeInfo?.themeColor,
            }}
        >
            {/* Personal Detail */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            {/* Summary */}
            <SummeryPreview resumeInfo={resumeInfo} />
            {/* Professional Experience */}
            {resumeInfo?.experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
            {/* Educational */}
            {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
            {/* Skills */}
            {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
        </div>
    );
}

export default ResumePreview;