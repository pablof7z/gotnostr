import { invoiceStatus } from '../lib/store.js';

export async function load({ fetch, params }) {
    fetch('https://legend.lnbits.com/api/v1/payments/sse', {
            method: 'GET',
            headers: {
                'x-api-key': '1b68362815324e63bcf708174f7d0851'
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