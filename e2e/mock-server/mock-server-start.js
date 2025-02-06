// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import mockserver from 'mockserver-node';

mockserver.start_mockserver({
  serverPort: 1080,
  jvmOptions: [
    '-Dmockserver.enableCORSForAPI=true',
    '-Dmockserver.enableCORSForAllResponses=true',
    '-Dmockserver.corsAllowOrigin=*',
    '-Dmockserver.corsAllowMethods="CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, PATCH, TRACE"',
    '-Dmockserver.corsAllowHeaders="Allow, Content-Encoding, Content-Length, Content-Type, ETag, Expires, Last-Modified, Location, Server, Vary, Authorization"',
    '-Dmockserver.corsAllowCredentials=true',
    '-Dmockserver.corsMaxAgeInSeconds=300',
  ],
});
