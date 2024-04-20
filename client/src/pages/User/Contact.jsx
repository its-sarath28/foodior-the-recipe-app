import React from "react";

const Contact = () => {
  return (
    <section className="section">
      <div className="flex flex-col justify-center">
        <form className="text-center w-[100%] sm:w-[450px] md:w-[768px] mx-auto">
          <h3 className="text-[28px] font-[600] mb-[30px]">Contact Us</h3>

          <div className="mb-[20px]">
            <input
              type="text"
              placeholder="Full name"
              className=" bg-[#dbdbdb] focus:outline-none w-full p-3 rounded-md"
            />
          </div>

          <div className="mb-[20px]">
            <input
              type="text"
              placeholder="Email"
              className=" focus:outline-none bg-[#dbdbdb] w-full p-3 rounded-md"
            />
          </div>

          <div className="mb-[20px]">
            <textarea
              type="text"
              placeholder="Message"
              className=" bg-[#dbdbdb] w-full p-3 rounded-md resize-none overflow-auto focus:outline-none"
              rows={7}
            ></textarea>
          </div>

          <button className="bg-[#333] p-2 w-full md:w-fit rounded text-white text-[18p6]">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
