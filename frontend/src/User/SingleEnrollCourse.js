import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { ThemeContext } from "../App";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
  },
};
Modal.setAppElement("body");
const SingleEnrollCourse = (props) => {
  const { user } = useContext(ThemeContext);
  const [rating, setRating] = useState(1);
  const [text, setText] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isReviewed,setIsReviewed] = useState(props.isReviewed)
  function openModal() {
    setIsOpen(true);
    console.log("Clicked");
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    setText("");
    setRating(1);
  }
  const handleRating = (rate) => {
    setRating(rate);
    // Some logic
  };
  const submitReview = () => {
    if (!text || !rating) {
      toast.warning("Add all the data");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .post(
        "http://localhost:5556/api/users/addreview",
        {
          rating,
          review: text,
          courseid: props.id,
          enrolledid: props.enrolledid,
        },
        config
      )
      .then((res) => {
        if (res.data && res.data?._id) {
          toast.success("Review Posted");
          closeModal();
          setIsReviewed(false)
        }
      });
  };
  const updateReview = ()=>{
    if (!text || !rating) {
      toast.warning("Add all the data");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
   toast.promise( axios
      .post(
        "http://localhost:5556/api/users/updatereview",
        {
          rating,
          review: text,
          courseid: props.id,
          enrolledid: props.enrolledid,
        },
        config
      )
      .then((res) => {
        if (res.data && res.data?._id) {
          toast.success("Review Updated");
          closeModal();
        }
      }),{
        pending: "Submiting Review..",
        
      });

  }
  const getReview = ()=>{

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    //console.log(props.id,config)
    axios
  .post(
    "http://localhost:5556/api/users/getreview",
    {
      courseid: props.id,
    },
    config
  )
  .then((res) => {
    if (res.data && res.data._id) {
      setText(res.data.text);
      setRating(res.data.rating)
      
    }
  });
  }
  return (
    <div>
      {user && (
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div></div>
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-2">
              <label htmlFor="">User Email</label>
              <input
                type="text"
                className=" p-4 rounded-lg"
                value={user.email}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Course Name</label>
              <input
                type="text"
                className=" p-4 rounded-lg"
                value={props.tittle}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Comment</label>
              <textarea
                type="text"
                className=" p-4 rounded-lg bg-[#d3d3d330]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="">
              {rating &&
              <ReactStars
                count={5}
                onChange={handleRating}
                size={24}
                value={rating}
                activeColor="#ffd700"
              />
              }
            </div>

            <div>
             {!isReviewed &&
               <button
               onClick={() => submitReview()}
               className="w-full text-[white] text-xl mx-auto block py-2 mb-5 bg-five  hover:bg-[green] rounded"
             >
               Submit
             </button>
             }
             {isReviewed &&
               <button
               onClick={() => updateReview()}
               className="w-full text-[white] text-xl mx-auto block py-2 mb-5 bg-five  hover:bg-[green] rounded"
             >
               Update
             </button>
             }
            </div>
          </div>
        </Modal>
      )}
      <div className="grid grid-cols-3 gap-10 justify-center items-center p-5 hover:shadow-sm cursor-pointer rounded bg-[#ffffff]">
        <div>
          <img className="w-50 h-50 rounded" src={props.img} alt="" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{props.tittle}</h1>
          <p className="py-5 text-xl">Enrolled: {props.createdAt}</p>
        </div>
        <div>
          { !isReviewed &&
            <button
              onClick={openModal}
              className="px-20 py-2 bg-[#36b323] hover:bg-[#2e9d1d] text-[white] rounded"
            >
              Add Review
            </button>
          }
          {
            isReviewed &&
            <button
              onClick={()=>{openModal();getReview();}}
              className="px-20 py-2 bg-[#36b323] hover:bg-[#2e9d1d] text-[white] rounded"
            >
              Update Review
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default SingleEnrollCourse;