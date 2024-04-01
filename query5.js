import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const client = await MongoClient.connect("mongodb://localhost:27017/");
const coll = client.db("ieeevisTweets").collection("tweet");
const tweets = await coll.find({}).toArray();

const users = new Set();
const userIds = new Set();

tweets.forEach((tweet) => {
  if (!userIds.has(tweet.user.id)) {
    users.add(tweet.user);
    userIds.add(tweet.user.id);
  }
});

const usersArray = Array.from(users);
await client.db("ieeevisTweets").collection("Users").insertMany(usersArray);

const tweetsWithoutUsers = [];
tweets.forEach((tweet) => {
  tweet.user_id = tweet.user.id;
  delete tweet.user;
  tweetsWithoutUsers.push(tweet);
});

await client.db("ieeevisTweets").collection("Tweets_Only").insertMany(tweetsWithoutUsers);


await client.close();
