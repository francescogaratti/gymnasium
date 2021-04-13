/** extra dependencies */
import * as nodemailer from 'nodemailer';
/** models */
import { User } from '../../../models/user';

const myEmail = 'dghiotto.dev@gmail.com'; // ! use .env variables
const password = 'Ghi8dev<'; // todo: add password with .env notation
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: myEmail,
		pass: password,
	},
});

export function sendWelcomeMail(user: User) {
	// options for the mail
	const mailOptions = {
		from: 'Ultra Gymnasium ' + myEmail,
		to: user.email,
		subject: 'Registration Ultra Gymnasium',
		html:
			`
			<body>
				<h3>
					Welcome ` +
			user.displayName +
			` 😄
				</h3>
				<p style="display: block;">
					This is a confirmation mail that you correctly registered at <strong>Ultra Gymnasium</strong>.
				</p>
				<a style="display: block;" href="https://ultra-gymnasium.web.app">Go to website<a />
			</body>	
		`,
	};
	// actual transporter / executor
	transporter.sendMail(mailOptions, (err: any, info: any) => {
		if (err) {
			console.log('Error', err);
			throw err;
		} else {
			console.info('Email sent', info);
		}
	});
	return;
}
