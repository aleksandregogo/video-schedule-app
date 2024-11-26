import React, { useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const maxSize = 500 * 1024 * 1024; // 500 MB

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      // Validate file size and MIME type
      if (!allowedMimeTypes.includes(selectedFile.type)) {
        alert("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }

      if (selectedFile.size > maxSize) {
        alert("File size exceeds the 500 MB limit.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      // Step 1: Request upload URL
      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: file.size, type: file.type }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileId } = await response.json();

      // Step 2: Upload file
      setUploadStatus("Uploading...");
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Step 3: Notify backend of completion
      const notifyResponse = await fetch("/api/upload-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      if (!notifyResponse.ok) {
        throw new Error("Failed to notify backend");
      }

      setUploadStatus("Upload complete!");
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>File Uploader</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploader;
