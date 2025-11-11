
import 'dotenv/config';

import { fetchRedditPosts } from '../lib/reddit';


(async () => {
  try {
    const data = await fetchRedditPosts('pics'); // or any subreddit
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();