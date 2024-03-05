import moment from "moment";

export default function TweetTime({ time }) {
  const formated = moment(time).fromNow();
  const timeFormat = moment(time).calendar();
  return (
    <div className="text-tertiary text-xs">
      <span>{timeFormat} - </span>
      <span>{formated}</span>
    </div>
  );
}
