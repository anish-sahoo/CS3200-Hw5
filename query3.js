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
  // if counting retweets and replies then comment this block
  if (
    tweet.retweeted_status ||
    tweet.in_reply_to_status_id ||
    tweet.in_reply_to_user_id
  )
    return;
  user.set(tweet.user.screen_name, (user.get(tweet.user.screen_name) || 0) + 1);
});

const sortedUsers = Array.from(user.entries()).sort((a, b) => b[1] - a[1]);
console.log(sortedUsers.slice(0, 1));

await client.close();

// Query3: (10pts) Who is the person that got the most tweets?