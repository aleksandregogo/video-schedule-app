import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Campaign } from "../types";

type MediaUploadModalProps = {
  campaign: Campaign;
  onClose: () => void;
  // onUpdateMedia: (campaignId: number, mediaInfo: object) => void;
};

const MediaUploadModal = ({
  campaign,
  onClose,
  // onUpdateMedia,
}: MediaUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!file) return;

    // Mock media info
    const mediaInfo = {
      name: file.name,
      size: file.size,
      price: file.size * campaign.screen.pricePerMb,
    };

    // onUpdateMedia(campaign.id, mediaInfo);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Upload Media</DialogTitle>
      <DialogContent className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <div>
            <p>
              <strong>File Name:</strong> {file.name}
            </p>
            <p>
              <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p>
              <strong>Price:</strong> $
              {(file.size / 1024 / 1024 * campaign.screen.pricePerMb).toFixed(
                2
              )}
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
