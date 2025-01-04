import Image from "next/image";
import React from "react";

type Props = {
  image: string;
  title: string;
  raised: string;
  description: string;
  category: string;
  sequence_id: string;
  onClick: () => void; // Add the onClick function type
};

const Card = ({
  image,
  title,
  raised,
  description,
  category,
  sequence_id,
  onClick, // Receive onClick as a prop
}: Props) => {
  return (
    <div
      className="w-60 h-fit flex flex-col border-2 rounded-xl cursor-pointer" // Add cursor-pointer to indicate it's clickable
      onClick={onClick} // Attach the onClick handler
    >
      <Image
        src={image}
        width={500}
        height={500}
        className="w-full h-32 object-cover rounded-xl"
        alt="card-image"
      />
      <div>
        <p>{title}</p>
      </div>
      <div>
        <p>Rs. {raised} raised</p>
      </div>
      <div className="shadow-md p-1 flex justify-center items-center w-fit text-sm">
        {category}
      </div>
    </div>
  );
};

export default Card;
