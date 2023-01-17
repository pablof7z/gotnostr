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
