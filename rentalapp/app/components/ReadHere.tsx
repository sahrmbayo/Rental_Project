// components/MustReadBanner.tsx
export default function ReadHere() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6 rounded-xl bg-white ring-1 ring-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-subtle-pulse">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-amber-700">
          MUST READ!
        </h2>

        <p className="mt-4 text-center text-neutral-700">
          Dear Valued Customer
        </p>
        <span className="text-neutral-600  text-justify">By reserving this property, you will be granted a three-day priority period to conclude an agreement with our agent. If no agreement is reached within this period, the property will be re-listed and made available to other applicants. Please note that a non-refundable reservation fee of NLe <strong>50</strong>  applies.</span>
      </div>

      <style jsx>{`
        @keyframes subtle-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.45); } /* light-yellow */
          70%  { box-shadow: 0 0 0 10px rgba(253, 224, 71, 0); }
          100% { box-shadow: 0 0 0 0 rgba(253, 224, 71, 0); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 3s ease-out infinite;
        }
      `}</style>
    </>
  );
}