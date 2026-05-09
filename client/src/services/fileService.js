import axios from "axios";

const API_URL = "http://localhost:5000/api/files";


// Get token
const getToken = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return userInfo.token;
};

// Upload file
export const uploadFile = async (fileData) => {

  const response = await axios.post(
    `${API_URL}/upload`,
    fileData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteFile = async (id) => {

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Get all files
export const getFiles = async () => {

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};