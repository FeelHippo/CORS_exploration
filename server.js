const http = require('http');
const fs = require('fs');

http.createServer(
    async (request, response) => {
        switch(request.method) {
            case 'GET':
                await getHandler(request, response);
                break;
            case 'POST':
                await postHandler(request, response);
                break;
        }
    }
).listen(
    process.env.NODE_PORT || 3001,
    console.info,
);

async function getHandler(request, response) {
    const { url, rawHeaders, method } = request;
    console.info(
        `Incoming call:
            ${method}
            ${url}
            ${rawHeaders}
        `
    );
    try {
        switch(url) {
            case '/basic-client-server':
                const xmlFile = fs.readFileSync('./note.xml');
                response.writeHead(
                    200,
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Keep-Alive': 'timeout=2, max=100',
                        'Connection': 'Keep-Alive',
                        'Content-Type': 'application/xml',
                    }
                );
                response.end(
                    xmlFile,
                    'binary',
                );
                break;
            default:
                response.end();
        }
    } catch (error) {
        console.error(error);
    }

}

async function postHandler(request, response) {
    const { url, rawHeaders, method } = request;
    const body = await bodyParser(request);
    console.info(
        `Incoming call:
            ${method}
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
  return new Promise((resolve, _reject) => {
    let body = '';
    request.on('data', data => body += data);
    request.on('end', () => resolve(body));
    request.on('error', console.error);
  });
};