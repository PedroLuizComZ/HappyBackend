import Users from "../models/Users";

export default {
	render(user: Users, jwt: string) {
		return {
			id: user.id,
			email: user.email,
			jwtToken: jwt,
		};
	},
	renderMany(users: Users[], jwt: string) {
		return users.map((user) => this.render(user, jwt));
	},
};
