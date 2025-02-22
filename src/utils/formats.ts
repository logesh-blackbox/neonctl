const BRANCH_PREFIX = 'br-';
const BRANCH_REGEX = /^br-[a-z0-9]+(-[a-z0-9]+){1,}$/;

/**
 * Checks if the given branch identifier looks like a valid branch ID.
 * @param branch - The branch identifier (string or number)
 * @returns True if the branch looks like a valid branch ID, false otherwise
 */
export const looksLikeBranchId = (branch: string | number): boolean => {
  const branchStr = typeof branch === 'number' ? branch.toString() : branch;
  return BRANCH_REGEX.test(branchStr);
};

const LSN_REGEX = /^[a-fA-F0-9]{1,8}\/[a-fA-F0-9]{1,8}$/;

export const looksLikeLSN = (lsn: string) => LSN_REGEX.test(lsn);

export const looksLikeTimestamp = (timestamp: string) =>
  !isNaN(Date.parse(timestamp));
