import React from "react";

const documents = [
  {
    title: "Rules & Regulations",
    description:
      "Important participation rules, attendance expectations, and workshop conduct guidelines.",
  },
  {
    title: "Privacy Policy",
    description:
      "How La Neuron handles personal data, contact submissions, and parent communication.",
  },
  {
    title: "Child Protection Policy",
    description:
      "Safeguarding principles, wellbeing commitments, and child protection standards.",
  },
  {
    title: "Parent Forms & Downloads",
    description:
      "Essential forms and supporting documents for registration and participation.",
  },
];

const Documents = () => {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="inline-block px-4 py-2 rounded-full border-2 border-[#0F172A] bg-white text-[#1B2A63] text-sm font-bold font-mono">
            Documents
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            Parent Information & Documents
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[#334155] leading-relaxed">
            Access key parent-facing documents, policies, and information pages
            related to participation, privacy, and safeguarding at La Neuron.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <article
              key={index}
              className="rounded-3xl border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] p-6"
            >
              <h2 className="text-2xl font-extrabold text-[#0F172A]">
                {doc.title}
              </h2>
              <p className="mt-3 text-[#475569] leading-relaxed">
                {doc.description}
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-full border-2 border-[#0F172A] bg-[#1B2A63] text-white font-bold font-mono hover:opacity-90 transition"
              >
                View document
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Documents;