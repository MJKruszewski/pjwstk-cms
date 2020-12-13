import {NextApiRequest, NextApiResponse} from "next";
import PcConfigurationsRepository from "@repository/pc-configurations.repository";
import {PcConfigurationDto} from "@domain/configuration.domain";
import {ConfigurationMapper} from "@service/configuration.mapper";
import {WithId} from "mongodb";
import ProductsRepository from "@repository/products.repository";
import {Types} from "mongoose";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const configurationRepository: PcConfigurationsRepository = await PcConfigurationsRepository.build();
    const productsRepository: ProductsRepository = await ProductsRepository.build();

    if (req.method === 'PUT') {
        await put(req, res, configurationRepository);
    } else if (req.method === 'GET') {
        await get(req, res, configurationRepository, productsRepository);
    } else {
        res.status(405).json({code: 'not-supported'});
    }
}

const put = async (req: NextApiRequest, res: NextApiResponse, configurationRepository: PcConfigurationsRepository) => {
    const configuration: PcConfigurationDto = req.body;
    const result = await configurationRepository.replaceOne(configuration.externalId, ConfigurationMapper.map(configuration));

    res.status(200).json(result.value);
};
const get = async (req: NextApiRequest, res: NextApiResponse, configurationRepository: PcConfigurationsRepository, productsRepository: ProductsRepository) => {
    const {id} = req.query;

    if (id === undefined) {
        res.status(404).json({code: 'not-fount'});

        return;
    }

    const configuration = await configurationRepository.findOneByExternalId(typeof id === 'string' ? id : id.pop());
    let components = [];

    for (const item of configuration.components) {
        components.push(await productsRepository.findOne(Types.ObjectId(item)));
    }

    components = components.filter((item) => {
        return item !== undefined && item !== null;
    });

    const response: WithId<PcConfigurationDto> = {
        _id: configuration._id,
        externalId: configuration.externalId,
        components: components,
    };

    res.status(200).json(response)
};