import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const API_ENDPOINTS = [
  { name: "Cat Facts", url: "https://catfact.ninja/fact" },
  { name: "Dog CEO", url: "https://dog.ceo/api/breeds/image/random" },
  { name: "Bitcoin Price", url: "https://api.coindesk.com/v1/bpi/currentprice.json" }
];

export default function ApiHealthDashboard() {
  const [apiStatuses, setApiStatuses] = useState({});

  useEffect(() => {
    const checkApiHealth = async () => {
      const results = {};
      for (const api of API_ENDPOINTS) {
        try {
          const response = await axios.get(api.url);
          results[api.name] = "healthy";
        } catch (error) {
          results[api.name] = "unhealthy";
        }
      }
      setApiStatuses(results);
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {API_ENDPOINTS.map((api, index) => (
          <motion.div
            key={api.name}
            className="backdrop-filter backdrop-blur-md bg-white bg-opacity-5 rounded-2xl border border-gray-200 border-opacity-10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="p-6 relative">
              <h2 className="text-2xl font-bold mb-4">{api.name}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Status</span>
                <motion.div
                  animate={{ 
                    scale: apiStatuses[api.name] === "healthy" ? [1, 1.2, 1] : 1,
                    backgroundColor: apiStatuses[api.name] === "healthy" ? ["#10B981", "#34D399", "#10B981"] : "#EF4444"
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-6 h-6 rounded-full shadow-lg ${
                    apiStatuses[api.name] === "healthy" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <p className="text-sm text-gray-300 break-all">{api.url}</p>
            </div>
            <div className={`h-1 w-full ${
              apiStatuses[api.name] === "healthy" ? "bg-green-500" : "bg-red-500"
            }`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}