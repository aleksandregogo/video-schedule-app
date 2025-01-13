import { APIClient } from "@/services/APIClient";
import React, { useRef } from "react";

type FileUploaderProps = {
  ownerId: number;
  uploadEndpoint: string;
  completeEndpoint: string;
  onComplete?: (key: string) => void;
  children: React.ReactNode;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  ownerId,
  uploadEndpoint,
  completeEndpoint,
  onComplete,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/mpeg",
    "audio/mp4",
    "audio/mpeg",
  ];
  const maxSize = 524288000; // 500MB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert("File size exceeds 500MB limit. Please select a smaller file.");
      return;
    }

    if (!allowedMimeTypes.includes(file.type)) {
      alert("Only JPEG, PNG, WEBP, MP4 files are allowed.");
      return;
    }

    try {
      const response = await APIClient.post(uploadEndpoint, {
        ownerId,
        size: file.size,
        mimeType: file.type
      })

      if (!response) {
        throw new Error("Failed to request upload URL");
      }

      const { uploadUrl, key } = response.data.data;

      if (uploadUrl) {


        const uploaded = await APIClient.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type
          },
          withCredentials: false,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          },
        });

        if (!uploaded) {
          throw new Error("Failed to upload file");
        }

        const done = await APIClient.post(completeEndpoint, {
          ownerId,
          size: file.size,
          mimeType: file.type,
          key
        });

        if (!done) {
          throw new Error("Failed to complete file upload");
        }

        const url = done.data?.imageDownloadUrl || done.data?.downloadUrl;

        onComplete && url && onComplete(url);
      }
    } catch (error) {
      console.error(`Upload failed: ${error.message}`);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const childrenWithOnClick = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Clone the element and attach the onClick handler
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: triggerFileInput,
      });
    }
    return child;
  });

  return (
    <div className="flex" onClick={triggerFileInput}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={allowedMimeTypes.join(",")}
        onChange={handleFileChange}
      />
      {childrenWithOnClick}
    </div>
  );
};

export default FileUploader;
