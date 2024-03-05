import image from "../../assets/images/image.png";

export default function TweetHeader() {
  return (
    <div className="w-full rounded-t-sm overflow-hidden">
      <img
        src={image}
        alt="Tweet Photo"
        className="w-full h-full rounded-t-sm"
      />
    </div>
  );
}
