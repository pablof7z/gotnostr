import Ajv from 'ajv';
import { fail, redirect } from '@sveltejs/kit';
import {createCustomPath} from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load(r) {
    return {};
};

const ajv = new Ajv();
const pathSchema = {
    type: 'string',
    minLength: 3,
    maxLength: 1000,
    pattern: '^[a-zA-Z0-9]+$',
    // errorMessages: {
    //     minLength: '🤔 that path is a bit on the short side; use at least three characters',
    //     maxLength: "That path is way too long!",
    //     pattern: 'Fancy path, but please keep it to just alphanumeric characters'
    // }
}

const nip05Schema = {
    type: 'string',
    minLength: 3,
    maxLength: 1000
}

export const actions = {
    create: async ({ request, resolve }) => {
        const data = await request.formData();
        const path = data.get('path');
        const nip05 = data.get('nip05');

        const pathValid = ajv.validate(pathSchema, path);
        if (!pathValid) {
            return fail(422, {
                errors: {
                    path: ajv.errors.map(e => e.message).join(', ')
                }
            });
        }

        const nip05Valid = ajv.validate(nip05Schema, nip05);
        if (!nip05Valid) {
            return fail(422, {
                errors: {
                    nip05: ajv.errors.map(e => e.message).join(', ')
                }
            });
        }

        // check if localhost:3000/{path} returns 404 or not
        // if not, return fail(400, 'Path already exists');
        // if yes, create nip05 and return success
        // const res = await fetch(`http://localhost:5173/${path}`);
        // if (res.status !== 404) {
        //     return fail(422, {
        //         errors: {
        //             path: `${path} is already in use. Try a different one`
        //         }
		// 	});
        // }

        try {
            console.log('will create');
            await createCustomPath(path, nip05)
            return { success: true, path };
        } catch (e) {
            return fail(422, {error: e});
        }
    }
}