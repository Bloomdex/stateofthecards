import React, { Component, RefObject, createRef } from "react";
import styles from "./RegisterForm.module.css";
import stylesB from "../Base.module.css";
import stylesL from "../Login.module.css";
import IUserInfo from "./LoginForm";
import FirebaseApp from "../config/Firebase";
import ReCAPTCHA from "react-google-recaptcha";
import ReactDOM from "react-dom";

interface IProps {
	onClickBack: () => void;
	onSubmitRegister: (userinfo: IUserInfo) => void;
}

interface IState {
	username: string;
	password: string;
	repeatPassword: string;
	errorMessage: string;
	validCaptcha: boolean;
}

class RegisterForm extends Component<IProps, IState> {
	recaptcha: any;
	private recaptchaRef: RefObject<ReCAPTCHA> = createRef();

	constructor(props: IProps) {
		super(props);

		this.state = {
			username: "",
			password: "",
			repeatPassword: "",
			errorMessage: "",
			validCaptcha: false,
		};

		this.recaptcha = (
			<div className={stylesL.recaptcha} id="reCAPTCHA">
				<ReCAPTCHA
					ref={this.recaptchaRef}
					size={"invisible"}
					sitekey="6Le5V6MZAAAAAFdzAqy9LtCm7B8OyBQF20HEpcyf"
					onChange={() => {
						this.setState({ validCaptcha: true });
						this.onSubmitRegister();
					}}
				/>
			</div>
		);
	}

	onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ username: event.target.value });
	};

	onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ password: event.target.value });
	};

	onRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ repeatPassword: event.target.value });
	};

	onSubmitRegister() {
		// Remove the error-message of the previous submit attempt.
		this.setState({ errorMessage: "" });

		// Check if the two passwords match.
		if (this.state.password !== this.state.repeatPassword) {
			this.setState({ errorMessage: "Passwords don't match." });
			return;
		}

		// Check and wait for the ReCAPTCHA
		this.recaptchaRef.current?.execute();

		if (this.state.validCaptcha) {
			// Register the user to the database.
			FirebaseApp.auth()
				.createUserWithEmailAndPassword(
					this.state.username,
					this.state.password
				)
				.catch((error) => {
					this.setState({ errorMessage: error.message });
				});
		}
	}

	render() {
		return (
			<div className={stylesL.formWrapper}>
				{ReactDOM.createPortal(this.recaptcha, document.body)}

				<div
					className={
						stylesB.buttonWrapper + " " + styles.buttonWrapper
					}
				>
					<button
						className={
							stylesB.interactiveFont +
							" " +
							stylesB.buttonBase +
							" " +
							stylesB.buttonFilledTertiary
						}
						onClick={() => {
							this.props.onClickBack();
						}}
					>
						Back
					</button>
				</div>
				<div className={stylesL.inputWrapper}>
					<input
						className={
							stylesB.interactiveFont + " " + stylesB.input
						}
						type="text"
						name="Username"
						placeholder="Username"
						required
						autoFocus
						onChange={this.onUsernameChange}
					/>

					<input
						className={
							stylesB.interactiveFont + " " + stylesB.input
						}
						id="password"
						name="Password"
						placeholder="Password"
						type="password"
						required
						onChange={this.onPasswordChange}
					/>

					<input
						className={
							stylesB.interactiveFont + " " + stylesB.input
						}
						id="password"
						name="RepeatPassword"
						placeholder="Repeat Password"
						type="password"
						required
						onChange={this.onRepeatPasswordChange}
					/>

					<p
						className={
							stylesB.interactiveFont + " " + stylesB.error
						}
					>
						{this.state.errorMessage}
					</p>
				</div>
				<div
					className={
						stylesB.buttonWrapper + " " + styles.buttonWrapper
					}
				>
					<button
						className={
							stylesB.interactiveFont +
							" " +
							stylesB.buttonBase +
							" " +
							stylesB.buttonFilledSecondary
						}
						onClick={() => {
							this.onSubmitRegister();
						}}
					>
						Register
					</button>
				</div>
			</div>
		);
	}
}

export default RegisterForm;
