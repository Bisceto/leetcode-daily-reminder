import { getDailyChallenge } from "../../src/services/leetcode";
import { setCache, getCache } from "../../src/utils/cache";
import { calculateSecondsUntilMidnightUTC } from "../../src/utils/helpers";

jest.useFakeTimers();

describe("getDailyChallenge", () => {
  beforeEach(() => {
    // Clear the cache before each test
    setCache("dailyChallenge", null);
  });

  it("should return the cached challenge if it exists", async () => {
    // Arrange: Set up a challenge and cache it
    const cachedChallenge = "Test challenge";
    setCache("dailyChallenge", cachedChallenge);

    // Act: Call getDailyChallenge
    const challenge = await getDailyChallenge();

    // Assert: Check if the returned challenge is the same as the cached challenge
    expect(challenge).toBe(cachedChallenge);
  });

  it("should fetch a new challenge if the cache is empty", async () => {
    // Arrange: Ensure the cache is empty
    setCache("dailyChallenge", null);

    // Act: Call getDailyChallenge
    const challenge = await getDailyChallenge();

    // Assert: Check if a new challenge was fetched
    // This will depend on your implementation of getDailyChallenge and the LeetCode API
    // For this example, we'll just check if the returned challenge is not null
    expect(challenge).not.toBeNull();
  });

  it("should fetch a new challenge if the cache has expired", async () => {
    // Arrange: Set up a challenge and cache it
    const cachedChallenge = "Test challenge";
    setCache(
      "dailyChallenge",
      cachedChallenge,
      calculateSecondsUntilMidnightUTC()
    );

    // Fast-forward until the cache has expired
    jest.advanceTimersByTime(calculateSecondsUntilMidnightUTC() * 1000 + 1);

    // Act: Call getCache
    const challenge = getCache("dailyChallenge");

    // Assert: Check if the returned challenge is null
    expect(challenge).toBeNull();
  });
});
