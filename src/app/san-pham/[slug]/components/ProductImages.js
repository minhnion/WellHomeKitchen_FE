"use client";
import Image from "next/image";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { API_BASE_URL } from "@/apiServices/constants";
import { FiPlus } from "react-icons/fi";

export default function ProductImages({ mainImage, galleryImages }) {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const allImages = [mainImage, ...galleryImages];
  const currentIndex = allImages.indexOf(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [isClickingArrow, setIsClickingArrow] = useState(false);

  const getFullImageUrl = (path) => {
    return `${path.startsWith("http") ? "" : API_BASE_URL}${path}`;
  };

  const navigateImage = (direction) => {
    const newIndex =
      (currentIndex + direction + allImages.length) % allImages.length;
    setCurrentImage(allImages[newIndex]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsDragging(true);
            setHasDragged(false);
            setStartX(e.clientX);
          }
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;

          const diff = e.clientX - startX;

          if (Math.abs(diff) > 60) {
            navigateImage(diff > 0 ? -1 : 1);
            setStartX(e.clientX);
            setHasDragged(true);
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);

          if (!hasDragged && !isClickingArrow) {
            setZoomOpen(true);
          }

          setIsClickingArrow(false);
        }}

        onMouseLeave={() => setIsDragging(false)}
        className="group w-full aspect-[3/4] md:aspect-[9/10] relative cursor-grab active:cursor-grabbing"

      >
        <Image
          src={getFullImageUrl(currentImage)}
          alt="Main Product Image"
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-contain p-4 transition-all duration-500 group-hover:scale-102"
          style={{ objectFit: "contain" }}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
            <FiPlus size={28} className="text-white" />
          </div>
        </div>

        {/* Image counter indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
          {currentIndex + 1} / {allImages.length}
        </div>

        {/* Navigation arrows */}
        <button
          onMouseDown={() => setIsClickingArrow(true)}
          onClick={(e) => {
            e.stopPropagation();
            navigateImage(-1);
          }}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-md opacity-70 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Previous image"
        >
          <IoChevronBackOutline size={24} className="text-gray-800" />
        </button>
        <button
          onMouseDown={() => setIsClickingArrow(true)}
          onClick={(e) => {
            e.stopPropagation();
            navigateImage(1);
          }}

          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-md opacity-70 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          aria-label="Next image"
        >
          <IoChevronForwardOutline size={24} className="text-gray-800" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 relative mx-4 my-4">
        {allImages
          .slice(0, allImages.length > 8 ? 7 : 8)
          .map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentImage(image)}
              className={`cursor-pointer w-full aspect-square overflow-hidden  transition-all duration-300 relative
        ${currentImage === image
                  ? "ring-2 ring-offset-2 ring-blue-500 shadow-lg transform scale-105 z-10"
                  : "opacity-80 hover:opacity-100 hover:shadow-md"
                }`}
            >
              <Image
                src={getFullImageUrl(image)}
                alt={`Gallery Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className={`transition-all ${currentImage === image
                  ? "brightness-105"
                  : "hover:brightness-100"
                  }`}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}

        {allImages.length > 8 && (
          <div
            onClick={() => setCurrentImage(allImages[7])}
            className="cursor-pointer w-full aspect-square overflow-hidden relative bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            <Image
              src={getFullImageUrl(allImages[7])}
              alt={`Gallery Image 8`}
              fill
              sizes="(max-width: 768px) 20vw, 10vw"
              className="opacity-40"
              style={{ objectFit: "contain" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full text-gray-800 font-medium">
                +{allImages.length - 7}
              </span>
            </div>
          </div>
        )}
      </div>
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="relative w-[85vw] h-[85vh] animate-zoomIn">
            <Image
              src={getFullImageUrl(currentImage)}
              alt="Zoom Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

    </div>
  );
}