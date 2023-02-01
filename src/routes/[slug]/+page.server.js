import {getCustomPath, getProfile} from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load(req) {
    const {slug} = req.params;
    let props = {}

    const nip05 = await getCustomPath(slug);
    const cachedProfile = await getProfile(slug);
    if (cachedProfile) {
        props.cachedProfile = cachedProfile;
    }

    if (nip05) {
        props.nip05 = nip05;
        props.premiumUrl = true;
    }

    return { props };
};