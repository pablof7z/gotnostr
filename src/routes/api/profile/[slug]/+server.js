/** @type {import('./$types').RequestHandler} */
export async function POST(req, data) {
    // get body sent to the svelte page
    const { slug } = req.params;
    console.log(req.request);
    // const body = await request.json();
    // console.log('here1');
    // console.log(body);
    // console.log('here4');
    return new Response();
};