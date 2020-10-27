import Image from "../models/Images";

export default {
	render(image: Image) {
		return {
			id: image.id,
			url: `${process.env.API_URL}/upload/${image.path}`,
		};
	},

	renderMany(images: Image[]) {
		return images.map((image) => this.render(image));
	},
};
