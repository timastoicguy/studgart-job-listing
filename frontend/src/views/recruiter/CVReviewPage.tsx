import React from "react";
import "@fontsource/dancing-script"; // Font viết tay
import "@fontsource/patrick-hand"; // Font viết tay khác

interface CVReviewProps {
  data: {
    summary: string;
    score: {
      summaryAndIntroduction: string;
      educationAndCertification: string;
      experienceAndProject: string;
      skills: string;
      totalScore: string;
      comment: string;
    };
    advantages: string[];
    downsides: string[];
  };
}

const TypingText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      className="text-lg text-gray-700"
      style={{
        fontFamily: '"Times New Roman", cursive',
        cursor: 'none', // This removes the typing cursor effect
      }}
    >
      {text}
    </div>
  );
};


const CVReviewPage: React.FC<CVReviewProps> = ({ data }) => {
  const { summary, score, advantages, downsides } = data;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg border rounded-lg">
      <div
        className="font-dancing-script text-center text-4xl mb-6 text-gray-700"
        style={{ fontFamily: '"Dancing Script", cursive' }}
      >
        CV Evaluation Report
      </div>

      {/* Summary */}
      <section className="mb-6">
        <h2
          className="font-patrick-hand text-2xl mb-2 text-gray-800"
          style={{ fontFamily: '"Patrick Hand", cursive' }}
        >
          Summary
        </h2>
        <TypingText text={summary} />
      </section>

      {/* Score Breakdown */}
      <section className="mb-6 d-flex flex-col">
        <h2
          className="font-patrick-hand text-2xl mb-2 text-gray-800"
          style={{ fontFamily: '"Patrick Hand", cursive' }}
        >
          Score Breakdown
        </h2>

        {Object.entries(score).map(([key, value], index) => (
          <TypingText
            key={index}
            text={`${key.replace(/([A-Z])/g, " $1")}: ${value}`}
          />
        ))}
      </section>

      {/* Advantages */}
      <section className="mb-6">
        <h2
          className="font-patrick-hand text-2xl mb-2 text-gray-800"
          style={{ fontFamily: '"Patrick Hand", cursive' }}
        >
          Advantages
        </h2>
        <ul
          className="list-disc list-inside text-gray-600"
          style={{ fontFamily: '"Patrick Hand", cursive' }}
        >
          {advantages.map((adv, index) => (
            <TypingText key={index} text={`${index + 1}. ${adv}`} />
          ))}
        </ul>
      </section>

      {/* Downsides */}
      <section>
        <h2 className="text-2xl font-patrick-hand text-gray-800"
        style={{ fontFamily: '"Patrick Hand", cursive' }}>Downsides</h2>
        {downsides.map((down, index) => (
          
          <TypingText key={index} text={`${index + 1}. ${down}`} />
        ))}
      </section>
    </div>
  );
};

export default CVReviewPage;
