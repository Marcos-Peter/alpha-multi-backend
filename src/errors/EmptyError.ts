import { BackEndErrors } from './BackEndErrors';

class EmptyError extends BackEndErrors
{
    public code = 404;
}

export { EmptyError };
