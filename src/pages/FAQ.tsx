const faqs = [
  {
    question: "What is Quizzer AI?",
    answer:
      "Quizzer AI is an intelligent quiz creation platform that helps users create, practice, and master subjects through flashcards, MCQs, and factual questions—powered by AI for speed and simplicity.",
  },
  {
    question: "Who is it for?",
    answer:
      "Students, teachers, lifelong learners, and anyone who enjoys structured, gamified learning.",
  },
  {
    question: "How does the AI work?",
    answer:
      "We’ve integrated Gemini AI to auto-generate questions, refine flashcards, and accelerate quiz creation while keeping it personalized.",
  },
  {
    question: "What types of quizzes can I create?",
    answer:
      "Flashcards, multiple-choice questions (MCQs), and factual (direct-answer) questions.",
  },
  {
    question: "Is it mobile-friendly?",
    answer:
      "Yes! Quizzer AI is built with responsive design, ensuring seamless use across devices.",
  },
  {
    question: "Is it free?",
    answer: "Yes, Quizzer AI is currently free to use.",
  },
  {
    question: "Any future plans?",
    answer:
      "There's a few interesting things in the works. Keep using Quizzer AI to know more.",
  },
];

const FaqSection = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-white/5 shadow-md rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
