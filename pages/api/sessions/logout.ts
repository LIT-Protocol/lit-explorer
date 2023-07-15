// pages/api/logout.ts
// @ts-nocheck

import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
	function logoutRoute(req, res, session) {
		req.session.destroy();
		res.send({ logged: false });
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
