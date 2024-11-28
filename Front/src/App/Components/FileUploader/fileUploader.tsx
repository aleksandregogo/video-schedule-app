import React, { useState } from "react";
import { ScheduleData } from "../Scheduler/scheduler";
import { APIClient } from "../../../Lib/APIClient";

type UploaderProps = {
  scheduleData: ScheduleData
}

// interface OwnerData {}

// const FILE_UPLOAD_OWNER = 

const FileUploader = ({ scheduleData }: UploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/mpeg", "audio/mp4", "audio/mpeg"];
  const maxSize = 524288000;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (file.size > maxSize) {
      alert("File size exceeds 500MB limit. Please select a smaller file.");
      return;
    }

    if (!allowedMimeTypes.includes(file.type)) {
      alert("Only JPEG, PNG, WEBP, MP4 files are allowed.");
      return;
    }

    setFile(file)
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    APIClient.post('/schedule/media/upload-request', {
      campaignId: scheduleData.id,
      size: file.size,
      mimeType: file.type
    })
      .then((response) => {
        const {
          uploadUrl,
          key,
          campaignId
        } = response.data.data;

        console.log({
          uploadUrl,
          key,
          campaignId
        });
        
        if (uploadUrl) {
          setUploadStatus("Uploading...");

          APIClient.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type
            },
            withCredentials: false,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadStatus(`Uploading: ${progress}%`);
            },
          })
            .then(() => {
              APIClient.post('/schedule/media/upload-complete', {
                campaignId: scheduleData.id,
                size: file.size,
                mimeType: file.type,
                key
              })
                .then(() => {
                  setUploadStatus(`Upload Completed`);
                  setFile(null);
                })
                .catch((error) => {
                  setUploadStatus(`Error: ${error.message}`);
                })
            })
            .catch((error) => {
              setUploadStatus(`Error: ${error.message}`);
            })
        } else {
          setUploadStatus(`Error: upload url is not provided`);
        }
      })
      .catch((error) => {
        setUploadStatus(`Error: ${error.message}`);
      })
  };

  return (
    <div>
      <h2>File Uploader</h2>
      <input type="file" onChange={(e) => handleFileChange(e)} />
      <button onClick={uploadFile} disabled={!file}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploader;
