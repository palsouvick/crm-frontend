import React from 'react'
import Layout from '../components/Layout'
import { useEffect,useState } from 'react'
import { fetchUserProfile } from '../api/authApi'

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async()=>{
        try{
            setLoading(true);
            const response = await fetchUserProfile();
            setUser(response.data.user);
            console.log(response.data.user);
        }catch(err){
            setError(err);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded shadow max-w-full">
        <div className="mb-4">
          <label className="block text-sm text-gray-500">Name</label>
          <p className="font-medium">{user?.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500">Email</label>
          <p className="font-medium">{user?.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500">Role</label>
          <p className="font-medium">{user?.role}</p>
        </div>

        <p className="text-sm text-gray-400">
          (Profile update API will be added later)
        </p>
      </div>
    </Layout>
  )
}

export default Profile