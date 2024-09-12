import React from 'react';
import PrimaryButton from './PrimaryButton';
import { PlusIcon } from '@heroicons/react/24/solid';

type Props = {
  onSelect: (data: { previewUrls: string[], files: File[] }) => void;
  isMultiple?: boolean;
}

const ImageUploader = ({ onSelect, isMultiple = true }: Props) => {

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) { return; }

    const files: File[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }

    const urls = await Promise.all(files.map(file => readFile(file)));
    onSelect({ previewUrls: [...urls], files: [...files] });
  };

  return (
    <div className="m-auto">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple={isMultiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <PrimaryButton 
        onClick={() => document.getElementById("file-upload")?.click()}
        EndContent={PlusIcon}
        isSecondaryColor={true}
      >
        Select Images
      </PrimaryButton>
    </div>
  );
};

export default ImageUploader;