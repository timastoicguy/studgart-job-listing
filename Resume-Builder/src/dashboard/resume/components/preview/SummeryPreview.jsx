import React from 'react'

function SummeryPreview({ resumeInfo }) {
  return (
    <p className="text-sm text-justify">
      {resumeInfo?.summery}
    </p>
  )
}

export default SummeryPreview