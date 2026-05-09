import { useEffect, useState } from "react";
import { getFiles, uploadFile, deleteFile } from "../services/fileService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {

    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
    navigate("/");
    }

    const fetchFiles = async () => {

      try {

        const data = await getFiles();

        setFiles(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchFiles();

  }, []);

  // handle file upload
  const handleUpload = async () => {

    if (!selectedFile) {
        alert("Please select a file");
        return;
    }

    try {

        const formData = new FormData();

        formData.append("file", selectedFile);

        const uploadedFile = await uploadFile(formData);

        setFiles([uploadedFile, ...files]);

        alert("File uploaded successfully");

    } catch (error) {

        console.log(error);

        alert("Upload failed");
    }
  };

// handle file delete
const handleDelete = async (id) => {

  try {

    await deleteFile(id);

    setFiles(
      files.filter((file) => file._id !== id)
    );

    alert("File deleted successfully");

  } catch (error) {

    console.log(error);

    alert("Delete failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            Cloud Storage System
          </h1>

          <p className="text-sm text-gray-500">
            Secure AWS S3 File Management
          </p>
        </div>

        <button
            onClick={() => {
                localStorage.removeItem("userInfo");
                window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
            >
            Logout
        </button>

      </nav>


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Upload Files
              </h2>

              <p className="text-gray-500 mt-1">
                Upload and manage your files securely in the cloud.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="file"
                onChange={(e) =>
                    setSelectedFile(e.target.files[0])
                }
                className="border border-gray-300 rounded-xl p-2"
              />

              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all duration-300"
                >
                Upload
              </button>

            </div>

          </div>

        </div>


        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-sm font-medium">
              Total Files
            </h3>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              {files.length}
            </p>

          </div>


          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-sm font-medium">
              Cloud Storage
            </h3>

            <p className="text-3xl font-bold mt-2 text-green-600">
              AWS S3
            </p>

          </div>


          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-sm font-medium">
              Cloud Status
            </h3>

            <p className="text-3xl font-bold mt-2 text-purple-600">
              Active
            </p>

          </div>

        </div>


        {/* File List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold text-gray-800">
              Uploaded Files
            </h2>

            <input
              type="text"
              placeholder="Search files..."
              className="border border-gray-300 rounded-xl px-4 py-2 w-52"
            />

          </div>


          <table className="w-full min-w-[700px]">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3 text-gray-600">
                  File Name
                </th>

                <th className="text-left py-3 text-gray-600">
                  Uploaded
                </th>

                <th className="text-left py-3 text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {files.map((file) => (

                <tr
                  key={file._id}
                  className="border-b hover:bg-gray-50 transition-all"
                >

                  <td className="py-4 font-medium text-gray-700">
                    {file.fileName}
                  </td>


                  <td className="py-4 text-gray-600">

                    {new Date(file.createdAt)
                      .toLocaleDateString()}

                  </td>


                  <td className="py-4 flex gap-3">

                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >

                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300">
                        Download
                      </button>

                    </a>

                        <button
                            onClick={() => handleDelete(file._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
                            >
                            Delete
                        </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}