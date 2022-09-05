import { APIResponse } from '../responses/APIResponse';
import { Response } from 'express';
import { ServiceResponse } from '../responses/ServiceResponse';
import { apiResponseBuilder } from '../responses/APIResponseBuilder';

class Controller
{
    protected async callService (res: Response, service: (param: any) => Promise<ServiceResponse>, serviceParam?: any)
    {
        let apiResponse = {} as APIResponse;

        try
        {
            const result = await service(serviceParam);
            apiResponse = apiResponseBuilder.writeResponse(result);
        }
        catch (error)
        {
            apiResponse = apiResponseBuilder.writeErrorResponse(error);
        }
        finally
        {
            res.status(apiResponse.code).json(apiResponse);
        }
    }
}

export { Controller };
