"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"; // Import useRouter

const supabase = createClient("https://onhkqbybsfqgqxdtcxgr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaGtxYnlic2ZxZ3F4ZHRjeGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjM4OTgsImV4cCI6MjA1ODE5OTg5OH0.qe-9MetjyfFjCFWdZkgnr4K5xW3-_LfTycDpyVQcusQ");

export default function Ongoing() {
  const [ongoingList, setOngoingList] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    project_name: "",
    capacity: "",
    qty: "",
    eng: "",
    region: "",
    recd: "",
    month: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch ongoing projects
  const fetchOngoing = async () => {
    const { data, error } = await supabase.from("Ongoing").select("*");
    if (error) console.error(error);
    else {
      setOngoingList(data);
      setFilteredProjects(data);
    }
  };

  useEffect(() => {
    fetchOngoing();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Insert or update record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supabase.from("Ongoing").update(formData).eq("id", editingId);
      } else {
        await supabase.from("Ongoing").insert([formData]);
      }
      setFormData({ project_name: "", capacity: "", qty: "", eng: "", region: "", recd: "", month: "" });
      setEditingId(null);
      fetchOngoing();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await supabase.from("Ongoing").delete().eq("id", id);
      fetchOngoing();
    }
  };

  // Load data into form for editing
  const handleEdit = (record) => {
    setFormData({ ...record });
    setEditingId(record.id);
  };

  // Search by project name
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = ongoingList.filter(project =>
      project.project_name.toLowerCase().includes(query) || 
      project.month.toLowerCase().includes(query) // Search by month
    );
    setFilteredProjects(filtered);
  };
  
const handelToggle = () => {
    router.push("/"); // Redirect to completed page
    }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={handelToggle}>move to completed</button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Ongoing Projects
          <span className="block mt-2 text-lg font-normal text-gray-600">
            Total Projects: {filteredProjects.length}
          </span>
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Object.entries(formData).map(([key, value]) => (
              key !== 'id' && (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type={['capacity', 'qty', 'recd'].includes(key) ? 'number' : 'text'}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {editingId ? "Update Project" : "Add New Project"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['SR', 'Project', 'Capacity', 'Qty', 'Engineer', 'Region', 'Recd', 'Month', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{record.project_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.eng}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.recd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}