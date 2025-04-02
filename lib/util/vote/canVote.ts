import { EProposalStatus } from "@/lib/types/post";
import { ACTIVE_PROPOSAL_STATUSES } from "@/lib/types/voting";
import dayjs from "dayjs";

export const canVote = (status?: EProposalStatus, preparePeriodEndsAt?: Date) => {
	return !!(status && preparePeriodEndsAt && ACTIVE_PROPOSAL_STATUSES.includes(status) && dayjs().isAfter(dayjs(preparePeriodEndsAt)));
};
