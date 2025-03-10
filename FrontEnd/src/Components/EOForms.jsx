import { useState } from "react";
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
} from "@mui/material";

export default function EOForm() {
	const [formData, setFormData] = useState({
		title: "",
		documentType: "Executive Order",
		number: "",
		dateIssued: "",
		policies: "",
		dateEffectivity: "",
		status: "Pending",
		relatedOrdinances: "",
	});

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
			setOpen(true); // ✅ Show success message
		} catch (error) {
			setMessage(null);
			setError(
				error.response?.data?.error || "Failed to submit form. Try again."
			);
			setOpen(true); // ✅ Show error message
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Card>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						File Archive System
					</Typography>

					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: "16px" }}
					>
						<TextField
							name="title"
							label="EO/Ordinance Title"
							onChange={handleChange}
							fullWidth
							required
						/>

						<TextField
							name="documentType"
							select
							label="Document Type"
							value={formData.documentType}
							onChange={handleChange}
							required
							fullWidth
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
							label="EO/Ordinance Number"
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							name="dateIssued"
							type="date"
							label="Date Enacted/Issued"
							InputLabelProps={{ shrink: true }}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							name="policies"
							label="Policies/Ordinances"
							multiline
							rows={3}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							name="dateEffectivity"
							type="date"
							label="Date of Effectivity"
							InputLabelProps={{ shrink: true }}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							name="status"
							select
							label="Status"
							value={formData.status}
							onChange={handleChange}
							required
							fullWidth
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
							label="Related EO/Ordinances"
							multiline
							rows={3}
							onChange={handleChange}
							required
							fullWidth
						/>
						<input
							type="file"
							accept="application/pdf"
							onChange={handleFileChange}
						/>
						<Button type="submit" variant="contained" color="primary">
							Submit
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* ✅ Floating Snackbar Notification */}
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				{message ? (
					<Alert
						onClose={handleClose}
						severity="success"
						sx={{ width: "100%" }}
					>
						{message}
					</Alert>
				) : error ? (
					<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
						{error}
					</Alert>
				) : null}
			</Snackbar>
		</div>
	);
}
