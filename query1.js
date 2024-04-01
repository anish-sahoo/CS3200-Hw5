import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const client = await MongoClient.connect("mongodb://localhost:27017/");
const coll = client.db("ieeevisTweets").collection("tweet");
const result = await coll.find({}).toArray();

const answer = result.filter(
  (tweet) =>
    !tweet.retweeted_status &&
    !tweet.in_reply_to_status_id &&
    !tweet.in_reply_to_user_id,
);

console.log(
  `Found ${answer.length} tweets that are not retweets or replies.`,
);

await client.close();

// Query1: (10pts) How many tweets are not retweets or replies? (hint the field retweeted_status contains an object when the tweet is a retweeet)