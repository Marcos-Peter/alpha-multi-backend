import { EmptyError } from '../errors/EmptyError';
import { ServiceResponse } from '../responses/ServiceResponse';

class Service
{
    protected serviceResponseBuilder (DAOResult: any[], emptyMessage: string, successCode = 200, echo: any = null): ServiceResponse
    {
        if (DAOResult.length <= 0) throw new EmptyError(emptyMessage);

        const serviceResponse =
            {
                code: successCode,
                echo,
                data: DAOResult.length === 1 ? DAOResult.pop() : DAOResult
            };

        return serviceResponse;
    }
}

export { Service };
