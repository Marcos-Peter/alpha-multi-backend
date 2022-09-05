import { BackEndErrors } from './BackEndErrors';

class ValidationError extends BackEndErrors
{
    public code = 400;
}

export { ValidationError };
