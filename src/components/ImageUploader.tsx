import React from 'react';

type Props = {
  onSelect: (data: { previewUrls: string[], files: File[] }) => void;
}

const ImageUploader = ({ onSelect }: Props) => {

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
    <div className="flex flex-col">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-secondary text-black py-2 px-4 rounded-lg"
      >
        Select Images
      </label>
      {/* {previewUrls && previewUrls.map((previewUrl, index) =>
        <img key={index} src={previewUrl} alt="Image Preview" style={{ width: '200px', height: '200px' }} />
      )} */}
      {/* <button 
        onClick={() => onUpload(selectedFiles)}
        className=""
      >
        Upload
      </button> */}
    </div>
  );
};

export default ImageUploader;