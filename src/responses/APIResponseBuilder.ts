import { APIResponse } from './APIResponse';
import { BackEndErrors } from '../errors/BackEndErrors';
import { ServiceResponse } from './ServiceResponse';

class APIResponseBuilder
{
    writeResponse (serviceResponse: ServiceResponse)
    {
        const response: APIResponse =
        {
            success: true,
            code: serviceResponse.code
        };

        if (serviceResponse.echo) response.echo = serviceResponse.echo;
        if (serviceResponse.data) response.data = serviceResponse.data;

        return response;
    }

    writeErrorResponse (error: any)
    {
        const errorCode = (error instanceof BackEndErrors) ? error.code : 500;

        const response: APIResponse =
        {
            success: false,
            code: errorCode,
            message: error.message.split('|')
        };

        return response;
    }
}

const apiResponseBuilder = new APIResponseBuilder();
export { apiResponseBuilder };
