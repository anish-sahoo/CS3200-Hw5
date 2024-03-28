import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const filter = {
  '$and': [
    {
      'retweet_count': {
        '$lte': 0
      }
    }, {
      'in_reply_to_user_id': null
    }, {
      'in_reply_to_status_id': null
    }
  ]
};

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.find(filter);
const result = await cursor.toArray();

console.log(result);
console.log(`Found ${result.length} documents`);

await client.close();