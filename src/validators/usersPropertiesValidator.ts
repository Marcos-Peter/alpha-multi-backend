import { PropertiesValidator } from './PropertiesValidator';
import { UserDTO } from '../models/DTOs/UserDTO';
import { ValidationError } from '../errors/ValidationError';

class UsersPropertiesValidator extends PropertiesValidator
{
    private readonly nameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    private readonly passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d!_@#$%¨&*?]{6,12}$/;

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
                'Nome do usuário deve ser de 3 a 20 caracteres utilizando apenas letras, dígitos, underscore ou ponto.');
        }
    }

    validatePassword (password: string)
    {
        if (!this.passwordRegex.test(password))
        {
            throw new ValidationError(
                'Senha deve possuir de 6 a 10 caracteres, contendo obrigatóriamente um número, uma letra minúscula e uma letra maiúscula, podendo conter caracter especial.');
        }
    }
}

const usersPropertiesValidator = new UsersPropertiesValidator();
export { usersPropertiesValidator };
