import snoowrap from 'snoowrap';
import 'dotenv/config';


const reddit = new snoowrap({
  clientId:'IyCjvFBKAcLKN-4jlRef8w',
  clientSecret: '6CL_RaKkxcVXV-s9VBty9LRXPtGuUw',
  username: 'Leading_ad83',
  password: 'moon@12#',
  userAgent:'vixtral-bot:1.0.0 by Leading_ad83',
});

export async function fetchRedditPosts(subreddit: string) {
  const posts = await reddit.getSubreddit(subreddit).getNew({ limit: 10 });
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    url: post.url,
    author: post.author.name,
    created_utc: post.created_utc,
  }));
}