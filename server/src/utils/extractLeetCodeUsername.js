const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{1,50}$/;

export const extractLeetCodeUsername = (value = "") => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("LeetCode username or profile URL is required.");
  }

  if (USERNAME_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    const username =
      segments[0] === "u"
        ? segments[1]
        : segments[0] === "profile"
          ? segments[1]
          : segments[0];

    if (!username || !USERNAME_PATTERN.test(username)) {
      throw new Error();
    }

    return username;
  } catch {
    throw new Error("Enter a valid LeetCode username or public profile URL.");
  }
};
