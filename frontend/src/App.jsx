export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              National Disaster Intelligence Platform
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Phase 1: Project Foundation & Environment Verification
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Frontend Online
          </span>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Core Modules (Planned Scope)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "1. AI Disaster Risk Assessment", status: "FastAPI Backend Ready" },
              { name: "2. Interactive Disaster Map", status: "Planned (Phase 3)" },
              { name: "3. Citizen Reporting", status: "Planned (Phase 4)" },
              { name: "4. Government Dashboard", status: "Planned (Phase 5)" },
            ].map((module) => (
              <div
                key={module.name}
                className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col justify-between"
              >
                <span className="text-sm font-medium text-slate-200">{module.name}</span>
                <span className="text-xs text-slate-500 mt-1">{module.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300 space-y-1">
          <p className="font-semibold text-amber-200">System Disclaimer:</p>
          <p>
            This platform operates as an analytical risk assessment system utilizing historical
            environmental trends. It does not provide guaranteed disaster predictions or exact timing.
          </p>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Node.js/Express API on port 5000 &bull; Python/FastAPI AI Service on port 8000 &bull; React + Tailwind on port 5173
          </p>
        </div>
      </div>
    </div>
  );
}
