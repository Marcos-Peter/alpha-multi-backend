import { AuctionDTO } from '../models/DTOs/AuctionDTO';
import { PropertiesValidator } from './PropertiesValidator';
import { ValidationError } from '../errors/ValidationError';

class AuctionsPropertiesValidator extends PropertiesValidator
{
    private readonly auctionNameRegex = /^[ A-Za-z0-9_-]{3,15}$/;
    private readonly auctionDescriptionLength = 10;
    private readonly auctionOpenAtDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    private readonly allValidators =
        [
            this.validateAuctionName.bind(this),
            this.validateAuctionDescription.bind(this),
            this.validateAuctionPhoto.bind(this),
            this.validateAuctionInitialPrice.bind(this),
            this.validateAuctionDuration.bind(this),
            this.validateAuctionOpenAt.bind(this)
        ];

    validateAll (auction: AuctionDTO)
    {
        const params = [ auction.name, auction.description, auction.photo, auction.initial_price, auction.duration, auction.open_at ];

        this.validateAllProperties(this.allValidators, params);
    }

    validateAuctionName (name: string)
    {
        if (!name || !this.auctionNameRegex.test(name))
        {
            throw new ValidationError(
                'Nome do leilão deve ser de 3 a 15 caracteres utilizando apenas letras, dígitos, espaço ou underscore');
        }
    }

    validateAuctionDescription (description: string)
    {
        if (!description || description.length < this.auctionDescriptionLength)
        {
            throw new ValidationError(
                `A descrição do leilão deve ter no mínimo ${this.auctionDescriptionLength} caracteres`);
        }
    }

    validateAuctionPhoto (photo: string)
    {
        if (!photo)
        {
            throw new ValidationError(
                'Não há foto para o leilão, favor providenciar.');
        }
    }

    validateAuctionInitialPrice (initial_price: string)
    {
        if (!initial_price)
        {
            throw new ValidationError(
                'Favor providenciar um preço inicial para o leilão.');
        }
    }

    validateAuctionFinalPrice (final_price: string)
    {
        if (!final_price)
        {
            throw new ValidationError(
                'Favor providenciar um preço final para o leilão.');
        }
    }

    validateAuctionDuration (duration: number)
    {
        if (!duration || (typeof duration !== 'number'))
        {
            throw new ValidationError(
                'Favor providenciar uma duração para o leilão, a duração deve ter um valor numérico representando os segundos que o leilão durará.');
        }
    }

    validateAuctionOpenAt (open_at: string)
    {
        if (!open_at || !this.auctionOpenAtDateRegex.test(open_at))
        {
            throw new ValidationError(
                'Favor providenciar uma data de abertura para o leilão, a data de abertura deve ter o formato "yyyy-mm-dd".');
        }

        if (!(new Date(open_at).getTime())) throw new ValidationError('Data passada é inválida.');
    }
}

const auctionsPropertiesValidator = new AuctionsPropertiesValidator();
export { auctionsPropertiesValidator };