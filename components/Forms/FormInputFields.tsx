import { TextField } from "@mui/material";
import { useState } from "react";
import MyButton from "../UI/MyButton";
import MyCard from "../UI/MyCard";
import { LinearProgressWithLabel } from "../UI/Progress";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

export interface MyFormData extends Array<MyFieldData> { }

export interface MyProgressI {
	progress?: number;
	message?: string;
}

interface MyFieldData {
	id: any;
	data: string;
}

export enum MyFieldType {
	CUSTOM = "custom",
	DATE_TIME_PICKER = "date-time-picker",
	DATE_PICKER = "date-picker",
	TEXT_FIELD = "text-field",
}

interface MyField {
	title?: string;
	label?: string;
	type?: MyFieldType;
	default?: string | number;
	render?: any;
}

interface CardInputsProps {
	title?: string;
	buttonText?: string;
	fields?: Array<MyField>;
	onSubmit?(formData: MyFormData): void;
	onChange?(e: any): void;
	progress?: MyProgressI;
	fullWidth?: boolean;
	i18n?: any;
}

const CardInputs = (props: CardInputsProps) => {
	// -- (states)
	const [formData, setFormData] = useState<MyFormData>([]);
	const [formDate, setFormDate] = useState<any>(null);

	// -- (declaration)
	const title = props.title ?? "- TITLE -";
	const buttonText = props.buttonText ?? "- MINT -";
	const fields = props?.fields ?? [];

	// -- (event) on button clicked
	const onClick = async (e: any) => {
		console.log("[onClick]formData:", JSON.stringify(formData));

		if (props?.onSubmit) {
			props.onSubmit(formData);
		}
	};

	// -- (event) on text change
	const handleChange = (d: any, index: number) => {
		console.log("[handleChange] index:", index);

		let data: MyFormData = [...formData];

		data[index] = {
			id: fields[index]?.title,
			data: d,
		};

		setFormData(data);

		if (props?.onChange) {
			props.onChange(data);
		}
	};

	// -- (render) date time picker field
	const renderDateTimePicker = (field: any, id: any) => {
		return (
			<div key={id} className="mt-24">
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DateTimePicker
						renderInput={(props) => <TextField {...props} />}
						label="DateTimePicker"

						// @ts-ignore
						disablePast={true}
						value={formDate}
						// @ts-ignore
						onChange={(newValue) => {
							handleChange(newValue, id);
							setFormDate(newValue);
						}}
					/>

				</LocalizationProvider>
			</div>
		);
	};
	const renderDatePicker = (field: MyField, id: any) => {
		return (
			<div key={id} className="mt-24">
				<LocalizationProvider dateAdapter={AdapterMoment}>

					<div className="mb-8">{field?.title}</div>
					<DatePicker

						// @ts-ignore
						rifmFormatter={(str) => {
							const d = str.split('/');
							if (d.length < 3) {
								return null;
							}

							return d[2] + '-' + d[0] + '-' + d[1];
						}}

						minDate={

							// use moment as 2 days from now
							// @ts-ignore
							moment().add(2, 'days')
						}

						// @ts-ignore
						value={formDate}

						// @ts-ignore
						disablePast={true}
						// @ts-ignore
						onChange={(e: any) => {
							// console.log(e);

							// get moment UTC time
							const moment = e;
							const utc = moment.toISOString();

							// set form date
							setFormDate(utc);
							handleChange(utc, id);

							console.log("utc:", utc);
						}}
						renderInput={(props) => <TextField {...props} />}
					/>


				</LocalizationProvider>
			</div>
		);
	};

	// -- (render) render text field
	const renderTextField = (field: MyField, id: any) => {
		return (
			<div key={id} className="mt-24">
				<div className="mb-4">{field?.title}</div>

				<TextField
					className="mt-8"
					label={field.label}
					size="small"
					fullWidth={true}
					onChange={(e) => {
						handleChange(e.target.value, id);
					}}
				/>
			</div>
		);
	};

	// -- (render) render all fields
	const renderFields = () => {
		return (
			<>
				<div className="my-fields">
					{fields?.map((field, i) => {
						switch (field.type) {
							case MyFieldType.CUSTOM:
								return field?.render(field, i);
							case MyFieldType.DATE_TIME_PICKER:
								return renderDateTimePicker(field, i);
							case MyFieldType.DATE_PICKER:
								return renderDatePicker(field, i);
							case MyFieldType.TEXT_FIELD:
							default:
								return renderTextField(field, i);
						}

					})}
				</div>
			</>
		);
	};

	// -- (render) render progress
	const renderProgress = () => {
		const progress = props?.progress?.progress ?? 0;

		if (progress > 0) {
			return (
				<>
					<LinearProgressWithLabel value={progress || 0} />
					{props.progress?.message}
				</>
			);
		} else {
			return "";
		}
	};

	// -- (render) submit button
	const renderButton = () => {
		return (
			<MyButton onClick={onClick} fullWidth={props.fullWidth}>
				{buttonText}
			</MyButton>
		);
	};

	return (
		<MyCard title={title}>
			<div className="mt-12 mb-12">{renderProgress()}</div>
			<div className="flex">{renderFields()}</div>
			<div className="mt-12 flex">
				{props.fullWidth ? (
					renderButton()
				) : (
					<div className="ml-auto flex">{renderButton()}</div>
				)}
			</div>
		</MyCard>
	);
};

export default CardInputs;
