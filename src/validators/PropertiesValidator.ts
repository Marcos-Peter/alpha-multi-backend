import { ValidationError } from '../errors/ValidationError';

class PropertiesValidator
{
    protected validateAllProperties (validators: ((param: any) => void)[], params: any[])
    {
        if (validators.length !== params.length)
        {
            // TODO This line could be a logger.
            console.log('Validator class => validateAll(): Validators length must be equal to params length.');
            throw new Error('Erro interno do servidor, favor consultar administração.');
        }

        let errorMessage = '';

        validators.forEach((validator, index) =>
        {
            try
            {
                validator(params[index]);
            }
            catch (error: any)
            {
                errorMessage += `${error.message}|`;
            }
        });

        if (errorMessage.length > 0) throw new ValidationError(errorMessage.slice(0, -1));
    }
}

export { PropertiesValidator };
