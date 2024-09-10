import React, { useState } from 'react';
import IconButton from './IconButton';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/solid';

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
          <IconButton 
            icon={<ChevronLeftIcon /> }
            onClick={goToPrevious}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-md p-2 cursor-pointer z-10"
            iconColor="text-white"
          />
          <IconButton 
            icon={<ChevronRightIcon /> }
            onClick={goToNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-md p-2 cursor-pointer z-10"
            iconColor="text-white"
          />
        </>
      }


      { onDelete && imageUrls.length > 0 &&
        <IconButton
          icon={<TrashIcon />}
          onClick={async () => { 
            await onDelete(imageUrls[currentIndex]);
            goToPrevious();
          }}
          className="absolute top-0 right-0 mt-2 mr-2 rounded-md bg-black bg-opacity-50 text-white border-none p-2 cursor-pointer z-10"
          iconColor="text-white"
        />
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