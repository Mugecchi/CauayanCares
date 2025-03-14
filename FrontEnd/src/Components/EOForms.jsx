import { useState, useRef } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	TextField,
	MenuItem,
	Button,
	Snackbar,
	Alert,
	IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function EOForm() {
	const [formData, setFormData] = useState({
		title: "",
		documentType: "Executive Order",
		number: "",
		dateIssued: "",
		details: "",
		dateEffectivity: "",
		status: "Pending",
		relatedOrdinances: "",
	});
	const dateInputRef = useRef(null);
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData();

		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});

		if (file) {
			data.append("file", file);
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/ordinances",
				data,
				{
					headers: { "Content-Type": "multipart/form-data" },
					withCredentials: true,
				}
			);
			setMessage(response.data.message);
			setError(null);
			setOpen(true);
		} catch (error) {
			setMessage(null);
			setError(
				error.response?.data?.error || "Failed to submit form. Try again."
			);
			setOpen(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Typography variant="h5" gutterBottom>
				File Archive System
			</Typography>

			<form onSubmit={handleSubmit}>
				<TextField
					name="title"
					label="Title"
					onChange={handleChange}
					required
				/>

				<TextField
					name="documentType"
					select
					label="Document Type"
					value={formData.documentType}
					onChange={handleChange}
					required
				>
					{["Executive Order", "Ordinance", "Memo", "Resolution"].map(
						(option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						)
					)}
				</TextField>

				<TextField
					name="number"
					label="Number"
					onChange={handleChange}
					required={formData.documentType !== "Memo"}
					disabled={formData.documentType === "Memo"}
				/>

				<TextField
					name="dateIssued"
					type="date"
					label="Date Enacted/Issued"
					InputLabelProps={{ shrink: true }}
					required
					inputRef={dateInputRef}
					onFocus={(e) => (e.target.showPicker ? e.target.showPicker() : null)}
				/>

				<IconButton onClick={() => dateInputRef.current?.showPicker()}>
					<CalendarTodayIcon />
				</IconButton>

				<TextField
					name="details"
					label="Details"
					multiline
					rows={3}
					onChange={handleChange}
					required
				/>

				<TextField
					name="dateEffectivity"
					type="date"
					label="Date of Effectivity"
					InputLabelProps={{ shrink: true }}
					onChange={handleChange}
					required={formData.documentType !== "Resolution"}
					disabled={formData.documentType === "Resolution"}
				/>

				<TextField
					name="status"
					select
					label="Status"
					value={formData.status}
					onChange={handleChange}
					required
				>
					{[
						"Pending",
						"Approved",
						"Implemented",
						"Under Review",
						"Amended",
					].map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</TextField>

				<TextField
					name="relatedOrdinances"
					label="Related Committee"
					multiline
					rows={3}
					onChange={handleChange}
					required
					disabled={formData.documentType === "Executive Order"}
				/>

				<input
					type="file"
					accept="application/pdf"
					onChange={handleFileChange}
					disabled={formData.documentType === "Memo"}
				/>

				<Button type="submit" variant="contained" color="primary">
					Submit
				</Button>
			</form>

			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				{message ? (
					<Alert onClose={handleClose} severity="success">
						{message}
					</Alert>
				) : error ? (
					<Alert onClose={handleClose} severity="error">
						{error}
					</Alert>
				) : null}
			</Snackbar>
		</div>
	);
}
