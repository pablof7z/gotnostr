import { invoiceStatus } from '../lib/store.js';

export async function load({ fetch, params }) {
    fetch('https://lnbits.f7z.io/api/v1/payments/sse', {
            method: 'GET',
            headers: {
                'x-api-key': 'cdb4e66603b84a44a24de5266da01452'
            }
        }).then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    invoiceStatus.set('check')
                }
            });
        })
        .catch((err) => {
            console.log('err', err);
        }
    );
}