// pages/api/login.ts
// @ts-nocheck

import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		console.log("req.session:", req.session);

		// get user from database then:
		req.session.logged = true;

		await req.session.save();
		res.send({
			logged: true,
		});
	},
	{
		cookieName: "is_logged",
		password: "complex_password_at_least_32_characters_long",
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	}
);
