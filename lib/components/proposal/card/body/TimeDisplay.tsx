import { ThemedText } from "@/lib/components/shared/text";
import { formatTime } from "@/lib/components/util/time";

function TimeDisplay({ createdAt }: { createdAt: string }) {
  const readableTime = formatTime(new Date(createdAt));
  return <ThemedText type="bodySmall3">{readableTime}</ThemedText>;
}	

export default TimeDisplay;