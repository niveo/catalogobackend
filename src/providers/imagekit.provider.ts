import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

export const imageKitProvider = [
  {
    provide: ImageKit.name,
    useFactory: (configService: ConfigService) => {
      return new ImageKit({
        publicKey: configService.get('IMAGEKIT_PUBLIC_KEY'),
        privateKey: configService.get('IMAGEKIT_PRIVATE_KEY'),
        urlEndpoint: configService.get('IMAGEKIT_URLENDPOINT'),
      });
    },
    inject: [ConfigService],
  },
];
