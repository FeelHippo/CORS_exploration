const http = require('http');

http.createServer(
    async (request, response) => {
        switch(request.method) {
            case 'POST':
                await postHandler(request, response);
                break;
        }
    }
).listen(
    3000, // Postman's default host is port 3000
    console.info,
);

async function postHandler(request, response) {
    const { url, rawHeaders } = request;
    const body = await bodyParser(request);
    console.info(
        `Incoming call:
            ${url}
            ${rawHeaders}
            ${body}
        `
    );
    try {
        switch(url) {
            case '/simple-request':
                response.writeHead(
                    201,
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Keep-Alive': 'timeout=2, max=100',
                        'Connection': 'Keep-Alive',
                        'Content-Type': 'application/json',

                    }
                );
                response.end(
                    JSON.stringify(
                        {
                            "headers": rawHeaders,
                            "body": body,
                        },
                    ),
                );
                break;
            default:
                response.end();
        }
    } catch (error) {
        console.error(error);
    }
}

async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', data => body += data);
    request.on('end', () => resolve(body));
    request.on('error', console.error);
  });
};