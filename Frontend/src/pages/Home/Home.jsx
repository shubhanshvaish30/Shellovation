import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { resetFilters } from "../../Redux/productSlice";
import Explore from "../../components/Explore/Explore";
import Display from "../../components/Display/Display";

function Home() {
  const images = [
    "url('/banner.png')",
    "url('/girl.png')",
    "url('/shoe.png')",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const category = useSelector((store) => store.product.category);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    dispatch(resetFilters());

    return () => clearInterval(interval);
  }, [images.length, dispatch]);

  const handleSlideChange = (newIndex) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const goToNext = () => {
    handleSlideChange((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    handleSlideChange((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="py-4">
      {/* Enhanced Carousel */}
      <div className="relative w-full h-[80vh] md:h-[60vh] lg:h-[50vh] overflow-hidden flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/70 backdrop-blur-sm border-2 border-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 ease-in-out hover:bg-black/90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
          onClick={goToPrev}
          disabled={isAnimating}
          style={{ opacity: isAnimating ? 0.5 : 1 }}
        >
          ‹
        </button>

        {/* Carousel Image */}
        <div
          className="w-11/12 h-full rounded-lg bg-cover bg-center transition-all duration-700 ease-in-out transform hover:scale-[1.02] shadow-2xl"
          style={{
            backgroundImage: images[currentIndex],
            opacity: isAnimating ? 0.8 : 1,
            transform: `scale(${isAnimating ? 0.98 : 1})`,
          }}
        />

        <button
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/70 backdrop-blur-sm border-2 border-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 ease-in-out hover:bg-black/90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
          onClick={goToNext}
          disabled={isAnimating}
          style={{ opacity: isAnimating ? 0.5 : 1 }}
        >
          ›
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Other Sections */}
      <Explore />
      <Display />
    </div>
  );
}

export default Home;