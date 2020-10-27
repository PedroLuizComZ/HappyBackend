import { Request, Response } from "express";

import { getRepository } from "typeorm";
import * as Yup from "yup";
import Orphanage from "../models/Orphanage";
import orphanageView from "../views/orphanage_view";

export default {
	async index(request: Request, response: Response) {
		const orphanagesRepository = getRepository(Orphanage);

		const orphanages = await orphanagesRepository.find({
			relations: ["images"],
		});

		return response.json(orphanageView.renderMany(orphanages));
	},

	async show(request: Request, response: Response) {
		const { id } = request.params;

		const orphanagesRepository = getRepository(Orphanage);

		const orphanage = await orphanagesRepository.findOneOrFail(id, {
			relations: ["images"],
		});

		return response.json(orphanageView.render(orphanage));
	},

	async showAproved(request: Request, response: Response) {
		const orphanagesRepository = getRepository(Orphanage);

		const orphanages = await orphanagesRepository
			.createQueryBuilder("orphanages")
			.where("status = :status", { status: "apr" })
			.getMany();

		return response.json(orphanages);
	},

	async showPendent(request: Request, response: Response) {
		const orphanagesRepository = getRepository(Orphanage);

		const orphanages = await orphanagesRepository
			.createQueryBuilder("orphanages")
			.where("status = :status", { status: "pen" })
			.getMany();

		return response.json(orphanages);
	},

	async create(request: Request, response: Response) {
		const {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends,
		} = request.body;

		const orphanagesRepository = getRepository(Orphanage);

		const requestImages = request.files as Express.Multer.File[];
		const images = requestImages.map((image) => {
			return { path: image.filename };
		});

		const data: any = {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends: open_on_weekends === "true",
			images,
			status: "pen",
		};

		const schema = Yup.object().shape({
			name: Yup.string().required(),
			latitude: Yup.number().required(),
			longitude: Yup.number().required(),
			about: Yup.string().required().max(300),
			instructions: Yup.string().required(),
			opening_hours: Yup.string().required(),
			open_on_weekends: Yup.boolean().required(),
			status: Yup.string().required(),
			images: Yup.array(
				Yup.object().shape({
					path: Yup.string().required(),
				})
			),
		});

		await schema.validate(data, {
			abortEarly: false,
		});

		const orphanage = orphanagesRepository.create(data);

		await orphanagesRepository.save(orphanage);

		return response.status(201).json(orphanage);
	},

	async update(request: Request, response: Response) {
		const {
			id,
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends,
		} = request.body;

		const orphanagesRepository = getRepository(Orphanage);

		const requestImages = request.files as Express.Multer.File[];
		const images = requestImages.map((image) => {
			return { path: image.filename };
		});

		const data: any = {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends: open_on_weekends === "true",
			// images,
		};

		const schema = Yup.object().shape({
			name: Yup.string().required(),
			latitude: Yup.number().required(),
			longitude: Yup.number().required(),
			about: Yup.string().required().max(300),
			instructions: Yup.string().required(),
			opening_hours: Yup.string().required(),
			open_on_weekends: Yup.boolean().required(),
			images: Yup.array(
				Yup.object().shape({
					path: Yup.string().required(),
				})
			),
		});

		await schema.validate(data, {
			abortEarly: false,
		});

		await orphanagesRepository.update(id, data);

		return response.status(201).json(data);
	},

	async delete(request: Request, response: Response) {
		const { id } = request.params;

		const orphanagesRepository = getRepository(Orphanage);

		await orphanagesRepository
			.createQueryBuilder("orphanages")
			.delete()
			.where("id = :id", { id: id })
			.execute();

		return response.status(201).json({ message: "Orphanage deleted" });
	},

	async aprove(request: Request, response: Response) {
		const { id } = request.params;

		const orphanagesRepository = getRepository(Orphanage);

		await orphanagesRepository
			.createQueryBuilder()
			.update("orphanages")
			.set({ status: "apr" })
			.where("id = :id", { id: id })
			.execute();

		return response.json({ message: "Orfanage aproved" });
	},
};
