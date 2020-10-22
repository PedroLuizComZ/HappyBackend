import { Request, Response } from "express";

import { getRepository } from "typeorm";
import * as Yup from "yup";
import Users from "../models/Users";
import usersView from "../views/users_view";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

export default {
	async index(request: Request, response: Response) {
		const { email, password } = request.body;

		const usersRepository = getRepository(Users);

		const user = await usersRepository
			.createQueryBuilder("users")
			.where("email = :email", { email: email })
			.getOne();

		if (!user) {
			return response.status(404).json({ message: "User not found" });
		}

		bcrypt.compare(password, user.password).then(function (result: any) {
			if (result) {
				var token = jwt.sign({ id: user.id }, "jwtConfigHappy", {
					expiresIn: 1800,
				});
				return response.json(usersView.render(user, token));
			} else {
				return response.status(404).json({ message: "User not found" });
			}
		});
	},

	async create(request: Request, response: Response) {
		const { email, password } = request.body;

		const usersRepository = getRepository(Users);

		const data = {
			email,
			password,
		};

		await bcrypt.hash(password, saltRounds, async function (
			err: any,
			hash: any
		) {
			data.password = hash;

			const schema = Yup.object().shape({
				email: Yup.string().required(),
				password: Yup.string().required(),
			});

			await schema.validate(data, {
				abortEarly: false,
			});

			const user = usersRepository.create(data);

			await usersRepository.save(user);

			return response.status(201).json(user);
		});
	},

	async validate(request: Request, response: Response) {
		const { token } = request.body;

		jwt.verify(token, "jwtConfigHappy", function (
			err: boolean,
			decoded: any
		) {
			if (err) {
				return response.status(401).json({
					auth: false,
					message: "Failed to authenticate token.",
				});
			}
			return response.status(200).json({
				auth: true,
				message: "User authenticated",
			});
		});
	},
};
