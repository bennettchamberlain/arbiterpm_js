'use server';

import { client } from '@/sanity/lib/client';
import { allPostsQuery } from '@/sanity/lib/queries';

export async function getProjects() {
  return await client.fetch(allPostsQuery);
} 