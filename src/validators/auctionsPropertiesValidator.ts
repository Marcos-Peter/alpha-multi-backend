import { AuctionDTO } from '../models/DTOs/AuctionDTO';
import { PropertiesValidator } from './PropertiesValidator';
import { ValidationError } from '../errors/ValidationError';

class AuctionsPropertiesValidator extends PropertiesValidator
{
    private readonly auctionNameRegex = /^[ A-Za-z0-9_-]{3,15}$/;
    private readonly auctionDescriptionLength = 10;
    private readonly auctionDateRegex = /([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})/;

    private readonly allValidators =
        [
            this.validateAuctionName.bind(this),
            this.validateAuctionDescription.bind(this),
            this.validateAuctionPhoto.bind(this),
            this.validateAuctionInitialPrice.bind(this),
            this.validateAuctionOpenAt.bind(this),
            this.validateAuctionCloseAt.bind(this)
        ];

    validateAll (auction: AuctionDTO)
    {
        const params = [ auction.name, auction.description, auction.photo, auction.initial_price, auction.open_at, auction.close_at ];

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

    validateAuctionWinnerPrice (winnerPrice: string)
    {
        if (!winnerPrice)
        {
            throw new ValidationError(
                'Favor providenciar o preço do ganhador para o leilão.');
        }
    }

    validateAuctionOpenAt (openAt: string)
    {
        if (!openAt || !this.auctionDateRegex.test(openAt))
        {
            throw new ValidationError(
                'Favor providenciar uma data de abertura para o leilão, a data de abertura deve ter o formato "yyyy-mm-dd 00:00:00".');
        }

        if (!(new Date(openAt).getTime())) throw new ValidationError('Data passada é inválida.');
    }

    validateAuctionCloseAt (closeAt: string)
    {
        if (!closeAt || !this.auctionDateRegex.test(closeAt))
        {
            throw new ValidationError(
                'Favor providenciar uma data de fechamento para o leilão, a data de fechamento deve ter o formato "yyyy-mm-dd 00:00:00".');
        }

        if (!(new Date(closeAt).getTime())) throw new ValidationError('Data passada é inválida.');
    }
}

const auctionsPropertiesValidator = new AuctionsPropertiesValidator();
export { auctionsPropertiesValidator };
