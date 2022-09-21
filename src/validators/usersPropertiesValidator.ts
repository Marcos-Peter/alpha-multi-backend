import { PropertiesValidator } from './PropertiesValidator';
import { UserDTO } from '../models/DTOs/UserDTO';
import { ValidationError } from '../errors/ValidationError';

class UsersPropertiesValidator extends PropertiesValidator
{
    private readonly nameRegex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%¨&*?])[A-Za-z\d!@#$%¨&*?]{8,10}$/;

    private readonly allValidators =
        [
            this.validateUserName.bind(this),
            this.validatePassword.bind(this)
        ];

    validateAll (user: UserDTO)
    {
        const params = [ user.username, user.password ];

        this.validateAllProperties(this.allValidators, params);
    }

    validateUserName (username: string)
    {
        if (!username || !this.nameRegex.test(username))
        {
            throw new ValidationError(
                'Nome do usuário deve ser de 8 a 20 caracteres utilizando apenas letras, dígitos, underscore ou ponto.');
        }
    }

    validatePassword (password: string)
    {
        if (!this.passwordRegex.test(password))
        {
            throw new ValidationError(
                'Senha deve possuir de 8 a 10 caracteres, começando por letra maiúscula, conter pelo menos um número e um caracter especial.');
        }
    }
}

const usersPropertiesValidator = new UsersPropertiesValidator();
export { usersPropertiesValidator };
