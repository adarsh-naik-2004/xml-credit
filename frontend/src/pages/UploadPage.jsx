import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadCloud, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "text/xml" || selectedFile.type === "application/xml")
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid XML file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("xmlFile", file);

    try {
      setLoading(true);
      const res = await axios.post("https://xml-credit.vercel.app/api/reports", formData);
      navigate(`/reports/${res.data._id}`);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-10 md:p-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-800 text-center">
        Upload XML File
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-300">
          <input type="file" accept=".xml" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
            <UploadCloud size={50} className="text-blue-500 mb-4" />
            <span className="text-lg md:text-xl font-medium text-gray-700">
              {file ? file.name : "Choose an XML file or drag it here"}
            </span>
            <span className="text-sm text-gray-500 mt-2">Only XML files are allowed</span>
          </label>
        </div>
        {error && (
          <div className="flex items-center text-red-500 bg-red-100 p-3 rounded-lg">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
}
