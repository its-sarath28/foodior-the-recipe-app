import React from "react";
import { formatDate } from "../utils/formatDate";

const Creator = ({ creatorName, creatorAvatar, createdAt }) => {
  return (
    <div className="flex items-center gap-1.5">
      <figure className="h-[35px] w-[35px]">
        <img
          src={creatorAvatar}
          alt="avatar"
          className="rounded-full h-full w-full border border-sky-700"
        />
      </figure>

      <div className="text-[14px]">
        <p className="">
          By <span className="font-[600]">{creatorName}</span>
        </p>
        <p>{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default Creator;
