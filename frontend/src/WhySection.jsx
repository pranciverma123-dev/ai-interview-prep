import { useEffect, useRef, useState } from "react";

function WhySection() {
  const items = [
    "🎯 Real Interview Simulation",
    "🧠 AI Feedback System",
    "💻 DSA Practice with AI Help",
    "📄 ATS Resume Scoring",
    "📊 Skill Gap Analysis",
    "🚀 Placement Ready System",
  ];

  const refs = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);

          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = refs.current;

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="px-6 md:px-10 py-20">

      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Why Choose <span className="text-orange-500">AI Interview Prep?</span>
      </h2>

      {/* DESCRIPTION */}
      <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12 text-sm md:text-base">
        A complete AI-powered placement preparation system designed to make you interview-ready faster, smarter, and more confidently.
      </p>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map((text, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => (refs.current[i] = el)}
          className={`
  bg-white/5 border border-white/10
  p-5 md:p-6 rounded-2xl
  min-h-[120px]
  flex items-center justify-center text-center
  text-sm md:text-base font-medium
  transition-all duration-700 fade-item
  hover:scale-105 hover:border-orange-500/50
  ${visible.includes(i) ? "show" : ""}
`}
          >
            {text}
          </div>
        ))}

      </div>
    </section>
  );
}

export default WhySection;