import { ThemedText } from "../../ThemedText";
import { formatTime } from "../../util/time";

function TimeDisplay({ createdAt }: { createdAt: string }) {
  const readableTime = formatTime(new Date(createdAt));
  return <ThemedText type="bodySmall3">{readableTime}</ThemedText>;
}	

export default TimeDisplay;