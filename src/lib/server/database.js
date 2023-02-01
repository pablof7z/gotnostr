import { createClient } from 'redis';

export async function createCustomPath(path, nip05) {
    const client = createClient();
    await client.connect();

    await client.HSET('custompaths', path, nip05);
    await client.disconnect();
}

export async function getCustomPath(path) {
    const client = createClient();
    await client.connect();

    const nip05 = await client.HGET('custompaths', path);
    await client.disconnect();

    return nip05;
}

export async function cacheProfile(slug, profile) {
    const client = createClient();
    await client.connect();

    await client.HSET('profiles', slug, JSON.stringify(profile));
    await client.disconnect();
}

export async function getProfile(slug) {
    const client = createClient();
    await client.connect();

    const profile = await client.HGET('profiles', slug);
    await client.disconnect();

    if (!profile) return null;
    return JSON.parse(profile);
}