// import React from "react";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Grid } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/grid";

import ReviewCard from "../card/ReviewCard";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState(null);
  useEffect(() => {
    fetch("http://localhost:5556/api/users/getreviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      });
  }, []);
  return (
    <>
      <div className=" mx-auto my-10">
        <h1 className="text-5xl font-bold text-center py-8">
          শিক্ষার্থীরা যা বলছে
        </h1>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Grid]}
          spaceBetween={0}
          slidesPerView={3}
          allowTouchMove={false}
          navigation={{ clickable: true }}
        >
          {reviews &&
            reviews.map((e) => {
              console.log(e)
              return <SwiperSlide>
                <ReviewCard comment={e.text} key={e._id}/>
              </SwiperSlide>
            })}
        </Swiper>
      </div>
    </>
  );
};

export default ReviewSlider;
