import React, { useState } from 'react';

type Props = {
  onUpload: (files: File[] | null) => void;
}

const ImageUploader = ({ onUpload }: Props) => {

  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) { return; }

    const files: File[] = [];
    const urls: string[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    setSelectedFiles([...files]);

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result as string);
        setPreviewUrls([...urls]);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      {previewUrls && previewUrls.map((previewUrl, index) =>
        <img key={index} src={previewUrl} alt="Image Preview" style={{ width: '200px', height: '200px' }} />
      )}
      <button onClick={() => onUpload(selectedFiles)}>Upload</button>
    </div>
  );
};

export default ImageUploader;