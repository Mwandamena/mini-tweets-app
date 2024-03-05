import placeholder from "../../assets/images/placeholder.png";
import image from "../../assets/images/image.png";
import cute from "../../assets/images/cute.jpg";

export default function Avatar({ size, img }) {
  return (
    <div className="overflow-hidden rounded-full w-10 h-10">
      <img
        src={placeholder}
        alt="Profile image"
        className={`w-${size} w-10 rounded-full object-cover`}
      />
    </div>
  );
}
