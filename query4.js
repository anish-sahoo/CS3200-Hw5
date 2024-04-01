import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const client = await MongoClient.connect("mongodb://localhost:27017/");
const coll = client.db("ieeevisTweets").collection("tweet");
const result = await coll.find({}).toArray();

const user = new Map();

result.forEach((tweet) => {
  const value = {
    tweetCount: user.get(tweet.user.screen_name)
      ? user.get(tweet.user.screen_name).tweetCount + 1
      : 1,
    retweetCount: user.get(tweet.user.screen_name)
      ? user.get(tweet.user.screen_name).retweetCount
      : 0,
  };
  if (
    tweet.retweeted_status ||
    tweet.in_reply_to_status_id ||
    tweet.in_reply_to_user_id
  ) {
    value.retweetCount = value.retweetCount + 1;
  }
  user.set(tweet.user.screen_name, value);
});

const sortedUsers = Array.from(user.entries()).filter(
  (user) => user[1].tweetCount > 3,
);

let retweetCount = 0;
Array.from(user.entries()).forEach((user) => {
  retweetCount += user[1].retweetCount;
});

const averageRetweetCount = retweetCount / sortedUsers.length;
console.log("Average retweet count:",averageRetweetCount);

const usersWithAverage = sortedUsers.filter(
  (user) => user[1].retweetCount > averageRetweetCount,
);
usersWithAverage.sort((a, b) => b[1].retweetCount - a[1].retweetCount);

console.log(usersWithAverage.slice(0, 10));

await client.close();

// Query4: (25pts) Who are the top 10 people that got more retweets in average, after tweeting more than 3 times