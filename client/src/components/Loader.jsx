import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ size, color }) => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default Loader;
