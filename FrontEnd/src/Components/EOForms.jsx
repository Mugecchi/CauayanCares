import { useState, useRef } from "react";
import {
	Typography,
	TextField,
	MenuItem,
	Button,
	Snackbar,
	Alert,
	Box,
	Card,
	CardContent,
	CardActions,
	Grid,
} from "@mui/material";
import { createOrdinance } from "../api";

export default function EOForm({ onClose, refreshData, onSuccess }) {
	const [formData, setFormData] = useState({
		title: "",
		documentType: "Executive Order",
		number: "EO No. ",
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

	const getNumberPrefix = (type) => {
		switch (type) {
			case "Executive Order":
				return "EO No. ";
			case "Ordinance":
				return "ORD No. ";
			case "Memo":
				return "MEMO No. ";
			case "Resolution":
				return "RESO No. ";
			default:
				return "";
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "number") {
			setFormData({
				...formData,
				[name]:
					getNumberPrefix(formData.documentType) +
					value.replace(getNumberPrefix(formData.documentType), ""),
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
				...(name === "documentType" && { number: getNumberPrefix(value) }),
			});
		}
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataToSend.append(key, value);
		});
		if (file) {
			formDataToSend.append("file", file);
		}

		try {
			const response = await createOrdinance(formDataToSend);
			setMessage(response?.message || "Successfully submitted!");
			setError(null);
			setOpen(true);

			if (refreshData && typeof refreshData === "function") {
				refreshData();
			}

			onClose?.();
			onSuccess?.(); // Close modal after successful submission
		} catch (err) {
			setMessage(null);
			setError(
				err?.response?.data?.error || "Failed to submit form. Try again."
			);
			setOpen(true);
		}
	};

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
			<CardContent>
				<Typography
					variant="h5"
					sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
				>
					File Archive System
				</Typography>

				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name="title"
								label="Title"
								onChange={handleChange}
								required
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
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
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
								name="number"
								label="Number"
								value={formData.number}
								onChange={handleChange}
								required={formData.documentType !== "Memo"}
								disabled={formData.documentType === "Memo"}
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
								name="dateIssued"
								type="date"
								label="Date Enacted/Issued"
								InputLabelProps={{ shrink: true }}
								required
								inputRef={dateInputRef}
								onChange={handleChange}
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
								name="dateEffectivity"
								type="date"
								label="Date of Effectivity"
								InputLabelProps={{ shrink: true }}
								onChange={handleChange}
								required={formData.documentType !== "Resolution"}
								disabled={formData.documentType === "Resolution"}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								name="details"
								label="Details"
								onChange={handleChange}
								required
								multiline
								rows={3}
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
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
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
								name="relatedOrdinances"
								label="Related Committee"
								onChange={handleChange}
								required
								disabled={formData.documentType === "Executive Order"}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button
								fullWidth
								variant="outlined"
								component="label"
								disabled={formData.documentType === "Memo"}
							>
								Upload PDF
								<input
									type="file"
									accept="application/pdf"
									hidden
									onChange={handleFileChange}
								/>
							</Button>
						</Grid>
					</Grid>

					<CardActions sx={{ mt: 2, justifyContent: "flex-end" }}>
						<Button type="submit" variant="contained" color="primary">
							Submit
						</Button>
						<Button onClick={onClose} variant="outlined">
							Cancel
						</Button>
					</CardActions>
				</form>
			</CardContent>

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
		</Box>
	);
}
