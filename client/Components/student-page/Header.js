import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Header = () => {
  const [adminForms, setAdminForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminForms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/feedback/admin-forms`);
        setAdminForms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching admin forms:", error);
        setError("Failed to load feedback forms");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminForms();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forms content removed */}
      </div>
    </div>
  );
};

export default Header;
