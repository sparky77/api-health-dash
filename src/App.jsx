import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apihealth-production.up.railway.app';

export default function ApiHealthDashboard() {
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [apiStatuses, setApiStatuses] = useState({});
  const [newEndpoint, setNewEndpoint] = useState({ name: '', url: '' });

  useEffect(() => {
    fetchEndpoints().then(() => checkApiHealth());
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEndpoints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/endpoints`);
      setApiEndpoints(response.data);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
    }
  };

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/check-health`);
      console.log('Health check response:', response.data);
      const healthResults = response.data.reduce((acc, endpoint) => {
        acc[endpoint._id] = endpoint.status;
        return acc;
      }, {});
      console.log('Processed health results:', healthResults);
      setApiStatuses(healthResults);
    } catch (error) {
      console.error('Error checking API health:', error);
    }
  };

  const addEndpoint = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/endpoints`, newEndpoint);
      setNewEndpoint({ name: '', url: '' });
      fetchEndpoints();
    } catch (error) {
      console.error('Error adding endpoint:', error);
    }
  };

  const deleteEndpoint = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/endpoints/${id}`);
      fetchEndpoints();
    } catch (error) {
      console.error('Error deleting endpoint:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 font-sans">
      <motion.h1
        className="text-5xl font-extrabold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="text-white drop-shadow-lg">
          API Health Dashboard
        </span>
      </motion.h1>

      <form onSubmit={addEndpoint} className="mb-8">
        <input
          type="text"
          placeholder="API Name"
          value={newEndpoint.name}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
          className="mr-2 p-2 rounded text black"
        />
        <input
          type="text"
          placeholder="API URL"
          value={newEndpoint.url}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
          className="mr-2 p-2 rounded text black"
        />
        <input
          type="text"
          placeholder="Bearer Token (optional)"
          value={newEndpoint.token}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, token: e.target.value })}
          className="mr-2 p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Endpoint</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apiEndpoints.map((api, index) => (
          <motion.div
            key={api._id}
            className="backdrop-filter backdrop-blur-md bg-white bg-opacity-5 rounded-2xl border border-gray-200 border-opacity-10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="p-6 relative">
              <h2 className="text-2xl font-bold mb-4">{api.name}</h2>
              {api.token && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Token Set</span>}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Status</span>
                <motion.div
                  animate={{
                    scale: apiStatuses[api._id] === "healthy" ? [1, 1.2, 1] : 1,
                    backgroundColor: apiStatuses[api._id] === "healthy" ? ["#10B981", "#34D399", "#10B981"] : "#EF4444"
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-6 h-6 rounded-full shadow-lg ${apiStatuses[api._id] === "healthy" ? "bg-green-500" : "bg-red-500"
                    }`}
                />
              </div>
              <p className="text-sm text-gray-300 break-all">{api.url}</p>
              <button
                onClick={() => deleteEndpoint(api._id)}
                className="mt-4 bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
            <div className={`h-1 w-full ${apiStatuses[api._id] === "healthy" ? "bg-green-500" : "bg-red-500"
              }`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}