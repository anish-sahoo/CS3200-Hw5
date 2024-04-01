import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const client = await MongoClient.connect("mongodb://localhost:27017/");
const coll = client.db("ieeevisTweets").collection("tweet");
const result = await coll.find({}).toArray();

const uniqueUsers = [];

// merge tweets from same users so that each user only shows up once
result.forEach((tweet) => {
  const { screen_name, followers_count } = tweet.user;
  const existingUserIndex = uniqueUsers.findIndex(
    (user) => user.screen_name === screen_name,
  );
  if (existingUserIndex !== -1) {
    uniqueUsers[existingUserIndex].followers_count = Math.max(
      uniqueUsers[existingUserIndex].followers_count,
      followers_count,
    );
  } else {
    uniqueUsers.push({ screen_name, followers_count });
  }
});

const answer = uniqueUsers
  .sort((user1, user2) => user2.followers_count - user1.followers_count)
  .slice(0, 10)
  .map(
    (user) => user.screen_name // + " has " + user.followers_count + " followers.",
  );
console.log(answer);

await client.close();

// Query2: (10pts) Return the top 10 screen_names by their number of followers.