import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpMethodEnum } from '@application/enums/http-method.enum';
import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';

import { HttpBffGateway } from './http.gateway';

@Injectable()
export class WishlistGateway extends HttpBffGateway implements WishlistGatewayPort {
  private readonly apiUrl: string;

  constructor(
    httpService: HttpService,
    private configService: ConfigService,
  ) {
    super(httpService);
    this.apiUrl = this.configService.get<string>('API_WISHLIST_URL') as string ;
  }

  async findAll(token: string): Promise<Wishlist[]> {
    const response = await this.gatewayHandler(
      '/v1/wishlists',
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async findById(token, uuid: string): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/v1/wishlists/${uuid}`,
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async create(token: string, createWishlistData: CreateWishlistInputDto): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      '/v1/wishlists',
      HttpMethodEnum.POST,
      createWishlistData,
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async removeItem(token: string, wishlistUuid: string, productUuid: string): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/v1/wishlists/${wishlistUuid}/items/${productUuid}`,
      HttpMethodEnum.DELETE,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }
}