import bcrypt from 'bcrypt';

class PasswordCryptography
{
    encryptPassword (password: string)
    {
        return bcrypt.hashSync(password, 10);
    }

    comparePassword (password: string, hash: string)
    {
        return bcrypt.compareSync(password, hash);
    }
}

const passwordCryptography = new PasswordCryptography();
export { passwordCryptography };
