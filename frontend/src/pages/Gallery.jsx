import React from "react";

const Gallery = () => {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="inline-block px-4 py-2 rounded-full border-2 border-[#0F172A] bg-white text-[#1B2A63] text-sm font-bold font-mono">
            Gallery
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            Moments from La Neuron
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[#334155] leading-relaxed">
            A visual glimpse into hands-on STEAM learning, scientific discovery,
            outdoor exploration, and themed workshop moments at La Neuron.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Workshop moments coming soon",
            "Science exploration gallery",
            "Outdoor discovery sessions",
            "Thematic workshop highlights",
            "Student project snapshots",
            "Lab and activity moments",
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] overflow-hidden"
            >
              <div className="h-56 bg-gradient-to-br from-[#C7D2FE] via-[#E2E8F0] to-[#BFDBFE]" />
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {item}
                </h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                  You can replace this placeholder block with real workshop
                  photos, event images, student activity shots, or project
                  outcomes.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Gallery;