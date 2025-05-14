import React, { useEffect, useState } from "react";
import { fetchDocumentation, addDocumentation } from "../api";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { WhiteBox } from "../Includes/styledComponents";
import { Typography } from "@mui/material";

function DocumentationReps() {
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedFiles, setSelectedFiles] = useState([]); // [{ file, tag }]
	const [selectedDocumentation, setSelectedDocumentation] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [error, setError] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	const IMG_BASE_URL =
		import.meta.env.MODE === "development"
			? "http://localhost:5000" // Local development
			: `${window.location.origin}`; // Production (Railway)

	useEffect(() => {
		getRecords();
	}, []);

	const getRecords = async () => {
		try {
			const response = await fetchDocumentation();
			setRecords(response || []);
		} catch (err) {
			setError({
				open: true,
				message: "Failed to load records.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		const withTags = files.map((file) => ({ file, tag: "" }));
		setSelectedFiles(withTags);
	};

	const handleSave = async () => {
		if (selectedFiles.length === 0) {
			setError({
				open: true,
				message: "Please select files to upload.",
				severity: "error",
			});
			return;
		}

		const missingTags = selectedFiles.some((f) => !f.tag.trim());
		if (missingTags) {
			setError({
				open: true,
				message: "Please enter tags for all files.",
				severity: "error",
			});
			return;
		}

		if (!selectedDocumentation?.ordinance_id) {
			setError({
				open: true,
				message: "Ordinance ID is required.",
				severity: "error",
			});
			return;
		}

		try {
			const formData = new FormData();
			selectedFiles.forEach(({ file, tag }) => {
				formData.append("files", file);
				formData.append("file_tags", tag);
			});
			formData.append("ordinance_id", selectedDocumentation.ordinance_id);

			const response = await addDocumentation(formData);

			const successMessage =
				response?.data?.message || "Documentation uploaded successfully.";

			setError({
				open: true,
				message: successMessage,
				severity: "success",
			});

			handleCloseModal();
			getRecords();
		} catch (error) {
			console.error("Error saving documentation:", error);
			setError({
				open: true,
				message:
					error?.response?.data?.message ||
					"Failed to save documentation. Please try again.",
				severity: "error",
			});
		}
	};

	const handleViewFiles = (documentation) => {
		setSelectedDocumentation(documentation);
		setOpenModal(true);
		setSelectedFiles([]); // reset file selection
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedDocumentation(null);
		setSelectedFiles([]);
	};

	return (
		<WhiteBox>
			<Typography variant="h4" color="#fff">
				Documentation Records
			</Typography>

			{/* List of documentation records */}
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Tags</TableCell>
							<TableCell>Action/s</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records
							.filter((documentation) => documentation.title !== null)
							.map((documentation) => (
								<TableRow key={documentation.ordinance_id} sx={{ mb: 2 }}>
									<TableCell>{documentation.title}</TableCell>
									<TableCell>
										{documentation.documentation_reports?.map((e, i, r) => (
											<span key={i}>
												{`${e.tag}${i === r.length - 1 ? " " : ","} `}
											</span>
										))}
									</TableCell>

									<TableCell>
										<Button
											variant="outlined"
											onClick={() => handleViewFiles(documentation)}
										>
											View / Add Files
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog
				open={openModal}
				onClose={handleCloseModal}
				maxWidth="sm"
				fullScreen
			>
				<DialogTitle>Upload Documentation Files</DialogTitle>
				<DialogContent dividers>
					<input
						type="file"
						multiple
						accept=".png,.jpg,.jpeg,.pdf,.docx"
						onChange={handleFileChange}
						style={{ marginBottom: "20px" }}
					/>

					{selectedFiles.length > 0 &&
						selectedFiles.map((fileObj, index) => (
							<Box key={index} sx={{ mb: 2 }}>
								<p>📄 {fileObj.file.name}</p>
								<TextField
									fullWidth
									label="Tag (e.g. memo, voucher, attendance sheet)"
									variant="outlined"
									value={fileObj.tag}
									onChange={(e) => {
										const updatedFiles = [...selectedFiles];
										updatedFiles[index].tag = e.target.value;
										setSelectedFiles(updatedFiles);
									}}
								/>
							</Box>
						))}

					{/* File Gallery (Grid to display file previews) */}
					{selectedDocumentation?.documentation_reports?.length > 0 && (
						<div>
							<h4>Uploaded Files</h4>
							<ImageList
								sx={{ width: "100%", height: "auto" }}
								cols={3}
								gap={8}
							>
								{selectedDocumentation.documentation_reports.map(
									(report, index) => (
										<ImageListItem key={index}>
											{/* Check if it's an image file and set the src accordingly */}
											{report.filepath.match(/\.(jpg|jpeg|png)$/) ? (
												<img
													src={`${IMG_BASE_URL}/${report.filepath}`} // Corrected image path
													alt={`File ${index}`}
													style={{
														width: "100%",
														height: "100%",
														maxHeight: "550px",
														borderRadius: "8px",
													}}
												/>
											) : (
												<iframe
													src={`${IMG_BASE_URL}/${report.filepath}`} // Corrected file preview path
													title={`File ${index}`}
													style={{
														width: "100%",
														height: "100%",
														maxHeight: "calc(50% -10px)",

														borderRadius: "8px",
													}}
												/>
											)}
											<ImageListItemBar
												title={report.related_documents?.join(", ")} // Display tags or file info
												position="below"
											/>
										</ImageListItem>
									)
								)}
							</ImageList>
						</div>
					)}
				</DialogContent>

				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button variant="contained" onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Error Snackbar */}
			<Snackbar
				open={error.open}
				autoHideDuration={4000}
				onClose={() => setError({ open: false, message: "", severity: "info" })}
			>
				<Alert
					onClose={() =>
						setError({ open: false, message: "", severity: "info" })
					}
					severity={error.severity}
					sx={{ width: "100%" }}
				>
					{error.message}
				</Alert>
			</Snackbar>
		</WhiteBox>
	);
}

export default DocumentationReps;
