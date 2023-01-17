import { error } from '@sveltejs/kit';
import {getCustomPath} from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load(req) {
    const {slug} = req.params;

    const nip05 = await getCustomPath(slug);

    if (nip05) {
        return {
            props: {
                nip05,
                premiumUrl: true
            }
        };
    } else {
        return {};
    }
};