import { BackEndErrors } from './BackEndErrors';

class UnauthorizedError extends BackEndErrors
{
    public code = 401;
}

export { UnauthorizedError };
