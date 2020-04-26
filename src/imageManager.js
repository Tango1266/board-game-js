const imagesPNG = require('./assets/images/*.png')

export default function getImageByName(name) {
    return imagesPNG[name];
}