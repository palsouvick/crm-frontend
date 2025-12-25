import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchUserProfile } from "../api/authApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetchUserProfile();
      setUser(response.data.user);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout>
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-sm text-gray-500">
          View your account information
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          Loading profile...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* PROFILE CARD */}
      {!loading && user && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">

          {/* TOP SECTION */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <ProfileItem label="Full Name" value={user.name} />
            <ProfileItem label="Email Address" value={user.email} />
            <ProfileItem label="Role" value={user.role} />
            <ProfileItem
              label="Account Status"
              value={
                <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                  Active
                </span>
              }
            />

          </div>

          {/* FOOTER NOTE */}
          <div className="mt-6 pt-4 border-t text-sm text-gray-400">
            Profile update feature will be added soon.
          </div>
        </div>
      )}
    </Layout>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">
      {label}
    </p>
    <p className="font-medium text-gray-800">
      {value}
    </p>
  </div>
);

export default Profile;
