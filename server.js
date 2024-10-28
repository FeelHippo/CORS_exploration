const http = require('http');
const fs = require('fs');

/// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
http.createServer(
    async (request, response) => {
        switch(request.method) {
            case 'GET':
                await getHandler(request, response);
                break;
            case 'POST':
                await postHandler(request, response);
                break;
            case 'OPTIONS':
                await optionsHandler(request, response);
                break;
        }
    }
).listen(
    process.env.NODE_PORT || 3001,
    console.info,
);

async function getHandler(request, response) {
    try {
        switch(request.url) {
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
                response.writeHead(404);
                response.end();
        }
    } catch (error) {
        console.error(error);
    }
}

async function postHandler(request, response) {
    const { url, headers } = request;
    const body = await bodyParser(request);
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
                            "headers": headers,
                            "body": body,
                        },
                    ),
                );
                break;
                case '/main-request-post-preflight':
                    response.writeHead(
                        200,
                        {
                            'Date': new Date().toISOString(),
                            'Access-Control-Allow-Origin': headers['origin'],
                            'Content-Type': 'text/plain',
                            'Vary': 'Accept-Encoding, Origin',
                            'Content-Encoding': 'gzip',
                            'Content-Type': 'text/plain',
                            'Keep-Alive': 'timeout=2, max=100',
                            'Connection': 'Keep-Alive',
                        }
                    );
                    response.end(
                        JSON.stringify(
                            {
                                "headers": headers,
                                "body": body,
                            },
                        ),
                    );
                    break;
            default:
                response.writeHead(404);
                response.end();
        }
    } catch (error) {
        console.error(error);
    }
}


/// Preflighted Requests
/// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests
/// for "preflighted" requests the client first sends an HTTP request using the OPTIONS method to the resource on the other origin, 
/// in order to determine if the actual request is safe to send.
/// Such cross-origin requests are preflighted since they may have implications for user data.
async function optionsHandler(request, response) {
    const { url, headers } = request;
    // this handles the preflight request with the OPTIONS method.
    // The client determines that it needs to send this based on the request parameters, 
    // so that the server can respond whether it is acceptable to send the request with the actual request parameters.
    // OPTIONS is an HTTP/1.1 method that is used to determine further information from servers, 
    // and is a safe method, meaning that it can't be used to change the resource. 
    // Note that along with the OPTIONS request, two other request headers are sent:
    // Access-Control-Request-Method: POST ==> notifies the server as part of a preflight request that when the actual request is sent, it will do so with a POST request method
    // Access-Control-Request-Headers: content-type,x-pingother ==> notifies the server that when the actual request is sent, it will do so with X-PINGOTHER and Content-Type custom headers
    // Now the server has an opportunity to determine whether it can accept a request under these conditions
    try {
        switch(url) {
            case '/preflight-request':
                response.writeHead(
                    204,
                    {
                        'Date': new Date().toISOString(),
                        'Access-Control-Allow-Origin': headers['origin'], // restricts access to the requesting origin domain only
                        'Access-Control-Allow-Methods': headers['access-control-request-method'], // says that POST is the valid method to query the resource in question
                        'Access-Control-Allow-Headers': headers['access-control-request-headers'], // these are permitted headers to be used with the actual request
                        'Access-Control-Max-Age': 86400, // gives the value in seconds for how long the response to the preflight request can be cached without sending another preflight request (24h)
                        'Content-Type': headers['accept'],
                        'Vary': 'Accept-Encoding, Origin',
                        'Keep-Alive': 'timeout=2, max=100',
                        'Connection': 'Keep-Alive',
                    }
                );
                response.end();
                break;
            default:
                response.writeHead(404);
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