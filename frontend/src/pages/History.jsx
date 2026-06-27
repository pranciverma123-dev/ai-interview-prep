import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "http://localhost:8000/api/interview/history",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data?.success && Array.isArray(data?.interviews)) {
        setInterviews(data.interviews);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black">
            Interview <span className="text-orange-500">History</span>
          </h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-400 mb-5">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="text-center text-zinc-400">
            Loading...
          </div>
        ) : interviews.length === 0 ? (
          /* EMPTY */
          <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center">
            <h2 className="text-xl font-bold">No Interviews Yet</h2>

            <button
              onClick={() => navigate("/create")}
              className="mt-5 bg-orange-500 px-5 py-2 rounded-xl"
            >
              Create Interview
            </button>
          </div>
        ) : (
          /* GRID */
          <div className="grid md:grid-cols-2 gap-6">

            {interviews.map((i) => (
              <div
                key={i._id}
                onClick={() => navigate(`/interview/${i._id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-orange-500 transition"
              >

                <h2 className="text-xl font-bold">
                  {i?.role || "Unknown Role"}
                </h2>

                <p className="text-sm text-zinc-400">
                  Questions: {i?.questions?.length ?? 0}
                </p>

                {/* STATUS SAFE */}
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-white/10">
                  {i?.status || "pending"}
                </span>

                {/* SCORE SAFE */}
                <div className="mt-4">
                  <p className="text-sm text-zinc-400">Score</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {typeof i?.score === "number" ? i.score : 0}/10
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default History;