import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

interface ImageSliderProps {
  imageUrls: string[];
  onDelete?: (imageUrl: string) => Promise<void> | null;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full h-[95%]">
      <img
        src={imageUrls[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className=" w-full h-full object-scale-down rounded-lg bg-secondary"
      />
      { imageUrls.length > 1 && <>
          <Button
            onClick={goToPrevious}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer z-10"
          >
           &#10094;
          </Button>
          <Button
            onClick={goToNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer z-10"
          >
            &#10095;
          </Button>
        </>
      }


      { onDelete &&
        <Button
          onClick={async () => { 
            await onDelete(imageUrls[currentIndex]);
            goToPrevious();
          }}
          className="absolute top-0 right-0 bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer z-10"
        >
          DEL
        </Button>
      }

      { imageUrls.length > 1 &&
        <div className="text-center mt-2">
          {imageUrls.map((_, index) => (

            <span
              key={index}
              className={`h-3 w-3 mx-1 rounded-full inline-block cursor-pointer ${currentIndex === index ? 'bg-secondary' : 'bg-gray-400'}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      }
    </div>
  );
};

export default ImageSlider;