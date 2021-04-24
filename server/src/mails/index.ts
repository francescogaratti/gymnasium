/** extra dependencies */
import * as nodemailer from 'nodemailer';
/** models */
import { User } from '../../../models/user';
import { Workout } from '../../../models/workout';
import { createWorkbook } from '../excel';

const email = process.env.DEV_EMAIL || 'dghiotto.dev@gmail.com';
const password = process.env.DEV_PASSWORD || 'Ghi8dev<';
const refresh_token =
	process.env.REFRESH_TOKEN ||
	'1//04Nf4GusHVNRzCgYIARAAGAQSNwF-L9IrXIy_ptZGcHGoQ9ypvX4gw0koYGbN1zo_ek_079sm61rHxezQwzIgbYam_1anAvpZDF8';
const access_token =
	process.env.ACCESS_TOKEN ||
	'ya29.a0AfH6SMDdMDG47UvakqhKXyty_wfxBVqzK61ZI9Ky-YSFOdXZpFV2dTJNz2Xje_glgiLpiKZjkJm4-FrZik3Lp7JJNls6vkLtS47hIGt2Vion8Qw6KXZYwHT8JPXJzBMdVlADAwFMJ-Xyn8p0herL5Dzsm-_V';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: email,
		pass: password,
		accessToken: access_token,
		refreshToken: refresh_token,
	},
});

export function sendWelcomeMail(user: User) {
	// options for the mail
	const mailOptions = {
		from: 'Ultra Gymnasium ' + email,
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

export async function sendWorkoutMail(user: User, workout: Workout) {
	const wb = createWorkbook(workout);
	const filename = workout.name + '.xlsx';
	const excel_buffer: any = await wb.writeToBuffer().then((buffer: any) => buffer);

	const mailOptions = {
		from: 'Ultra Gymnasium ' + email,
		to: user.email,
		subject: 'New Training Program 📝🔥',
		html:
			`
			<body>
				<h3>
					Your new training program <em>` +
			workout.name +
			`<em> is ready!
				</h3>				
				<p style="display: block;">
					` +
			user.displayName +
			` 😄 <br>
					You can find it with all the other past programs in your <a href="https://ultra-gymnasium.web.app/personal-area/">Personal Area</a>.
				</p>
				<p style="display: block;">
					This is yours <a href="https://ultra-gymnasium.web.app/train?id=` +
			workout.id +
			`"> new program<a />.
				</p>
			</body>
			`,
		attachments: [
			{
				filename: filename,
				content: excel_buffer,
			},
		],
	};

	transporter.sendMail(mailOptions, (err: any, info: any) => {
		if (err) {
			console.log('Error', err);
			throw err;
		} else {
			console.info('Email sent', info);
			return info;
		}
	});
	return;
}
