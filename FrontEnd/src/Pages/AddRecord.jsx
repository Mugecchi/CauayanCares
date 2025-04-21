import React, { useState } from "react";
import {
	Box,
	Button,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Typography,
	Grid,
	StepConnector,
	Snackbar,
	Alert,
} from "@mui/material";
import { createOrdinance } from "../api";
import Step1 from "../Components/Formsteps/firstStep";
import Step2 from "../Components/Formsteps/secondStep";
import Step3 from "../Components/Formsteps/thirdStep";
import Step4 from "../Components/Formsteps/fourthStep";
import Step5 from "../Components/Formsteps/fifthStep";
import Step6 from "../Components/Formsteps/sixthStep";
import Step8 from "../Components/Formsteps/eighthStep";
import { WhiteBox } from "../Includes/styledComponents";

const steps = [
	"Basic Info",
	"Coverage Scope",
	"Budget Allocations",
	"Objectives Implementation",
	"Monitoring Compliance",
	"Impact Asessment",
	"File Upload",
];

const AddRecord = () => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [formValues, setFormValues] = useState({});

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSubmit = async () => {
		const isValid = validateForm();
		if (!isValid) {
			setSnackbar({
				open: true,
				message: "Form validation failed. Please check the inputs.",
				severity: "error",
			});
			return;
		}

		try {
			const data = new FormData();
			Object.entries(formValues).forEach(([key, value]) => {
				if (key === "file_path" && value instanceof File) {
					data.append("file_path", value);
				} else {
					data.append(key, value);
				}
			});

			await createOrdinance(data);
			setSnackbar({
				open: true,
				message: "Record created successfully!",
				severity: "success",
			});
			setFormValues({}); // reset form
			setActiveStep(0); // go back to step 1
		} catch (error) {
			console.error("Error submitting form:", error);
			setSnackbar({
				open: true,
				message: "An error occurred while submitting the form.",
				severity: "error",
			});
		}
	};

	const updateForm = (values) => {
		setFormValues((prev) => ({ ...prev, ...values }));
	};

	const validateForm = () => {
		// Perform your form validation here
		// Example: Ensure required fields are filled
		if (!formValues.title || !formValues.number) {
			console.log("Title and Number are required!");
			return false;
		}
		// Add other validation checks as necessary
		return true;
	};

	const renderStep = () => {
		switch (activeStep) {
			case 0:
				return <Step1 formValues={formValues} updateForm={updateForm} />;
			case 1:
				return <Step2 formValues={formValues} updateForm={updateForm} />;
			case 2:
				return <Step3 formValues={formValues} updateForm={updateForm} />;
			case 3:
				return <Step4 formValues={formValues} updateForm={updateForm} />;
			case 4:
				return <Step5 formValues={formValues} updateForm={updateForm} />;
			case 5:
				return <Step6 formValues={formValues} updateForm={updateForm} />;

			case 6:
				return <Step8 formValues={formValues} updateForm={updateForm} />;
			default:
				return null;
		}
	};
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success", // 'success' | 'error'
	});

	const stepInstructions = [
		"Provide the title, ordinance number, and basic description.",
		"Define the ordinance's coverage scope and target beneficiaries.",
		"Input budget allocations, utilization, GAD budget, and funding sources.",
		"Specify policy objectives, implementing agencies, and key provisions.",
		"Set the monitoring frequency and describe compliance and indicators.",
		"Summarize impact assessment, community feedback, and challenges.",
		"Upload related ordinance files (PDF, images, documents).",
	];

	return (
		<>
			<WhiteBox sx={{ padding: "60px" }}>
				<Grid container spacing={3}>
					{/* Stepper Column */}
					<Grid item xs={3}>
						<Stepper
							activeStep={activeStep}
							orientation="vertical"
							connector={
								<StepConnector
									sx={{
										"& .MuiStepConnector-line": {
											borderColor: "var(--eminence)", // Default line color
											borderWidth: 3,
										},
										"& .Mui-active .MuiStepConnector-line": {
											borderColor: "var(--eminence)", // Active step line color'
										},
									}}
								/>
							}
						>
							{steps.map((label, index) => (
								<Step key={label}>
									<StepLabel
										onClick={() => setActiveStep(index)}
										sx={{
											cursor: "pointer",
											fontSize: "1rem", // Font size for the label
											fontWeight: activeStep === index ? "bold" : "normal", // Bold font for the active step
											"& .MuiStepLabel-iconContainer": {
												color: "var(--eminence)", // Change the icon color
												"& .MuiStepIcon-root": {
													border: "2px solid var(--eminence)", // Border color
													borderRadius: "50%", // Circle shape
													fontSize: "2rem", // Icon size
													backgroundColor: "var(--eminence)", // Background color
													fill: activeStep === index ? "white" : "var(--white)",
												},
											},
										}}
									>
										<Typography
											variant={activeStep === index ? "h6" : "body2"}
											fontWeight="bold"
										>
											{label}
										</Typography>
									</StepLabel>
									<StepContent
										sx={{
											borderLeft: "3px solid var(--eminence)", // Left border color
										}}
									>
										<Typography variant="body2">
											{stepInstructions[index]}
										</Typography>
									</StepContent>
								</Step>
							))}
						</Stepper>
					</Grid>

					<Grid item xs={9}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								minHeight: "550px",
								height: "100%",
								maxHeight: "550px",
							}}
						>
							<Box sx={{ flexGrow: 1 }}>{renderStep()}</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									mt: 2,
									pt: 2,
								}}
							>
								<Button
									disabled={activeStep === 0}
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									Back
								</Button>
								{activeStep === steps.length - 1 ? (
									<Button
										variant="contained"
										onClick={handleSubmit}
										sx={{ mt: 1, mr: 1 }}
									>
										Submit
									</Button>
								) : (
									<Button
										variant="contained"
										onClick={handleNext}
										sx={{ mt: 1, mr: 1 }}
									>
										Continue
									</Button>
								)}
							</Box>
						</Box>
					</Grid>
				</Grid>
			</WhiteBox>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default AddRecord;
