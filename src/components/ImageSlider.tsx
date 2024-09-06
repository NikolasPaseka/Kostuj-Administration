import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

interface ImageSliderProps {
  imageUrls: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-72 h-48">
      <img
        src={imageUrls[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="w-full h-full object-cover"
      />
      <Button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer"
      >
        &#10094;
      </Button>
      <Button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer"
      >
        &#10095;
      </Button>
      <div className="text-center mt-2">
        {imageUrls.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 mx-1 rounded-full inline-block cursor-pointer ${currentIndex === index ? 'bg-secondary' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;