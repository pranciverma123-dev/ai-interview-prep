import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/profile", {
        method: "GET",
        credentials: "include", // cookie auth
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load profile");
        navigate("/login");
        return;
      }

      setUser(data.user);

    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-[#111] border border-orange-500/30 rounded-3xl p-8 shadow-xl">

        <h1 className="text-4xl font-bold text-center text-white">
          My <span className="text-orange-500">Profile</span>
        </h1>

        <div className="mt-8 space-y-5">

          <div>
            <p className="text-gray-400">First Name</p>
            <p className="text-white text-lg">
              {user?.firstname || "Not Available"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Last Name</p>
            <p className="text-white text-lg">
              {user?.lastname || "Not Available"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white text-lg">
              {user?.email || "Not Available"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">User ID</p>
            <p className="text-white text-lg break-all">
              {user?._id}
            </p>
          </div>

        </div>

        <button
          onClick={logout}
          className="w-full mt-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold text-white"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;