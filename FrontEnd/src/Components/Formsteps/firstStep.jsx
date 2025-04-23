import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";

const Step1 = ({ formValues, updateForm }) => {
	const [formState, setFormState] = useState({
		title: formValues.title || "",
		documentType: formValues.documentType || "Executive Order",
		number: formValues.number || "",
		status: formValues.status || "Pending",
		dateIssued: formValues.dateIssued || "",
		dateEffectivity: formValues.dateEffectivity || "",
		details: formValues.details || "",
		file: formValues.file || null, // Add file to the state
	});

	// Sync formState with formValues from parent
	useEffect(() => {
		setFormState({
			title: formValues.title || "",
			documentType: formValues.documentType || "Executive Order",
			number: formValues.number || "",
			status: formValues.status || "Pending",
			dateIssued: formValues.dateIssued || "",
			dateEffectivity: formValues.dateEffectivity || "",
			details: formValues.details || "",
			file: formValues.file || null, // Update file from formValues
		});
	}, [formValues]);

	// Handle changes for fields
	const handleFieldChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => {
			const newState = { ...prevState, [name]: value };
			updateForm(newState); // Update parent state
			return newState;
		});
	};

	// Handle document type change with number prefix
	const handleDocumentTypeChange = (e) => {
		const selectedType = e.target.value;
		const numberPrefix = getNumberPrefix(selectedType);
		setFormState((prevState) => {
			const updatedState = {
				...prevState,
				documentType: selectedType,
				number: numberPrefix + (prevState.number || ""),
			};
			updateForm(updatedState); // Ensure the new state includes documentType
			return updatedState;
		});
	};

	// Get number prefix based on document type
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

	// Handle file change
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormState((prevState) => {
				const updatedState = { ...prevState, file };
				updateForm(updatedState); // Pass the file to the parent component
				return updatedState;
			});
		}
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={6}>
				<TextField
					fullWidth
					label="Title"
					required
					name="title"
					value={formState.title || ""}
					onChange={handleFieldChange}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					fullWidth
					label="Number"
					name="number"
					value={formState.number || "EO No. "}
					onChange={handleFieldChange}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					select
					fullWidth
					label="Status"
					name="status"
					value={formState.status || "Pending"}
					onChange={handleFieldChange}
				>
					{[
						"Pending",
						"Approved",
						"Implemented",
						"Under Review",
						"Amended",
					].map((status) => (
						<MenuItem key={status} value={status}>
							{status}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item xs={6}>
				<TextField
					select
					fullWidth
					label="Document Type"
					name="documentType"
					value={formState.documentType || "Executive Order"}
					onChange={handleDocumentTypeChange}
				>
					{["Executive Order", "Ordinance", "Memo", "Resolution"].map(
						(type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						)
					)}
				</TextField>
			</Grid>
			<Grid item xs={6}>
				<TextField
					fullWidth
					label="Date Issued"
					type="date"
					name="dateIssued"
					InputLabelProps={{ shrink: true }}
					value={formState.dateIssued || ""}
					onChange={handleFieldChange}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					fullWidth
					label="Date Effectivity"
					type="date"
					name="dateEffectivity"
					InputLabelProps={{ shrink: true }}
					value={formState.dateEffectivity || ""}
					onChange={handleFieldChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Details"
					name="details"
					value={formState.details || ""}
					onChange={handleFieldChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<Button fullWidth variant="outlined" component="label">
					Upload PDF
					<input
						type="file"
						accept="application/pdf"
						hidden
						onChange={handleFileChange}
					/>
				</Button>
				{formState.file && (
					<div style={{ marginTop: 10 }}>
						<span>{formState.file.name}</span>
					</div>
				)}
			</Grid>
		</Grid>
	);
};

export default Step1;
