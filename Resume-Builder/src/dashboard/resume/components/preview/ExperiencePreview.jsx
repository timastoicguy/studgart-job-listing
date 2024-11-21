import React from 'react'

function ExperiencePreview({ resumeInfo }) {
    return (
        <div className='my-6'>
            <h2 className='text-center font-bold text-base mb-2'
                style={{
                    color: resumeInfo?.themeColor
                }}
            >Professional Experience</h2>
            <hr style={{
                borderColor: resumeInfo?.themeColor
            }} />

            {resumeInfo?.experience?.map((experience, index) => (
                <div key={index} className='my-5'>
                    <h2 className='text-base font-bold'
                        style={{
                            color: resumeInfo?.themeColor
                        }}>{experience?.title}</h2>
                    <h2 className='text-sm flex justify-between'>{experience?.companyName}

                        <span>{experience?.startDate} - {experience?.currentlyWorking ? 'Present' : experience.endDate} </span>
                    </h2>
                    {/* <p className='text-xs my-2'>
                    {experience.workSummery}
                </p> */}
                    <div className='text-sm my-2' dangerouslySetInnerHTML={{ __html: experience?.workSummery }} />
                </div>
            ))}
        </div>
    )
}

export default ExperiencePreview