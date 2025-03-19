import { useState, useRef } from "react";
import axios from "axios";
import {
	Typography,
	TextField,
	MenuItem,
	Button,
	Snackbar,
	Alert,
	IconButton,
	InputAdornment,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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
					value={formData.number}
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
					onChange={handleChange}
					onFocus={(e) => e.target.showPicker && e.target.showPicker()}
				/>
				<IconButton onClick={() => dateInputRef.current?.showPicker()}>
					<CalendarTodayIcon />
				</IconButton>

				<TextField
					name="details"
					label="Details"
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
					onChange={handleChange}
					required
					disabled={formData.documentType === "Executive Order"}
				/>

				<Button
					variant="contained"
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
