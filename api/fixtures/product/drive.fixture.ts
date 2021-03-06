import * as faker from 'faker';
import {ProductFeatureCodeEnum, ProductTypeEnum} from '@apiDomain/product.domain';
import { FixturesService } from '@apiFixture/fixtures.service';

interface Drive {
    interface: string[]
}

const brands = [
  'WD',
  'Seagate',
  'ADATA'
];

const support: Drive =
    {
      interface: [
        'M.2',
        'SATA'
      ]
    };

const driveImages = [
  'products/drive1.png',
  'products/drive2.png'
];

export async function driveFixture () {
  for (const brand of brands) {
    const quantity = faker.random.number({ min: 12, max: 50 });
    for (let i = 0; i < quantity; i++) {
      const features = [];

      features.push({
        code: ProductFeatureCodeEnum.PRODUCER,
        value: brand
      });
      const driveInterface = faker.random.arrayElement(support.interface);
      features.push({
        code: ProductFeatureCodeEnum.DRIVE_INTERFACE,
        value: driveInterface
      });

      features.push({
        code: ProductFeatureCodeEnum.CAPACITY,
        value: Math.pow(2, faker.random.float({ min: 8, max: 12, precision: 1 })).toFixed(0).toString() + 'Gb'
      });

      features.push({
        code: ProductFeatureCodeEnum.LOAD_SPEED,
        value: faker.random.float({ min: 400, max: 3000, precision: 100 }).toFixed(0).toString() + 'Mb/s'
      });

      features.push({
        code: ProductFeatureCodeEnum.SAVE_SPEED,
        value: faker.random.float({ min: 200, max: 1000, precision: 100 }).toFixed(0).toString() + 'Mb/s'
      });

      await FixturesService.insertOneProduct(ProductTypeEnum.STORAGE, driveImages, features, null);
    }
  }
}
