import {cacheProfile} from '$lib/server/database';

/** @type {import('./$types').RequestHandler} */
export async function POST(req) {
    const {slug} = req.params;
    const { profile } = await req.request.json();

    console.log('will cache', {slug, profile});

    await cacheProfile(slug, profile);
    return new Response();
};