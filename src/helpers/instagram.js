const { IgApiClient } = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
const path = require('path');
const _ = require('lodash');
const { format_description_instagram } = require('./format_description_instagram');
const read_file_async = promisify(readFile);

const ig = new IgApiClient();

ig.state.generateDevice('ecommerce_shop_uz');

module.exports.post_album_instagram = async (data) => {
    try {
        // Data
        const images = _.get(data, ['images']);
        const description = format_description_instagram(data)

        // Login Into Account
        await ig.simulate.preLoginFlow();
        const user = await ig.account.login('ecommerce_shop_uz', 'blackLordUz');

        const images_for_post = Promise.all(_.map(images, async (item) => {
            const file_name = _.get(item, ['file_name']);
            return {
                file: await read_file_async(path.resolve('public/uploads/instagram', file_name))
            };
        }));
        await ig.publish.album({
            items: await images_for_post,
            caption: description
        })
    } catch (e) {
    }
};
