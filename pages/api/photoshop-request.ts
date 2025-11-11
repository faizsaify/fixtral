import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRedditPosts } from '../../lib/reddit';
import { cacheManager } from '../../lib/cache';

const CACHE_KEY = 'reddit_photoshop_requests';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  created_utc: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    // Try to get from cache first
    if (!forceRefresh) {
      const cachedPosts = cacheManager.get<RedditPost[]>(CACHE_KEY, CACHE_DURATION);
      if (cachedPosts) {
        return res.status(200).json(cachedPosts);
      }
    }

    // If not in cache or force refresh, fetch new data
    const posts = await fetchRedditPosts('PhotoshopRequest');
    
    // Filter for image posts only
    const imagePosts = posts.filter(
      (post) =>
        post.url &&
        (post.url.endsWith('.jpg') || 
         post.url.endsWith('.jpeg') || 
         post.url.endsWith('.png') ||
         post.url.endsWith('.webp'))
    );

    // Store in cache
    cacheManager.set(CACHE_KEY, imagePosts, CACHE_DURATION);
    
    res.status(200).json(imagePosts);
  } catch (err) {
    console.error('Failed to fetch Reddit posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts', details: String(err) });
  }
}
