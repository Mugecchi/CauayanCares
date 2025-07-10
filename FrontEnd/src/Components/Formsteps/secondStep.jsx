import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";

const Step2 = ({ formValues, updateForm }) => {
	const handleChange = (e) => {
		const { name, value } = e.target;
		updateForm({ [name]: value });
	};

	const handleGeographicalChange = (event) => {
		const selected = event.target.value;
		updateForm({
			geographical_coverage: selected.join(","), // stored as CSV for backend
		});
	};

	const barangays = [
		"City-Wide",
		"Alicaocao",
		"Alinam",
		"Amobocan",
		"Andarayan",
		"Baculod",
		"Baringin Norte",
		"Baringin Sur",
		"Buena Suerte",
		"Bugallon",
		"Buyon",
		"Cabaruan",
		"Cabugao",
		"Carabatan Bacareno",
		"Carabatan Chica",
		"Carabatan Grande",
		"Carabatan Punta",
		"Casalatan",
		"Cassap Fuera",
		"Catalina",
		"Culalabat",
		"Dabburab",
		"De Vera",
		"Dianao",
		"Dissimuray",
		"District I (Poblacion)",
		"District II (Poblacion)",
		"District III (Poblacion)",
		"Duminit",
		"Faustino (Sipay)",
		"Gagabutan",
		"Gappal",
		"Guayabal",
		"Labinab",
		"Linglingay",
		"Mabantad",
		"Maligaya",
		"Manaoag",
		"Marabulig I",
		"Marabulig II",
		"Minante I",
		"Minante II",
		"Nagcampegan",
		"Naganacan",
		"Nagrumbuan",
		"Nungnungan I",
		"Nungnungan II",
		"Pinoma",
		"Rizal",
		"Rizaluna",
		"Rogus",
		"San Antonio",
		"San Fermin (Poblacion)",
		"San Francisco",
		"San Isidro",
		"San Luis",
		"San Pablo (Casap Hacienda)",
		"Santa Luciana (Daburab 2)",
		"Santa Maria",
		"Sillawit",
		"Sinippil",
		"Tagaran",
		"Turayong",
		"Union",
		"Villa Concepcion",
		"Villa Luna",
		"Villaflor",
	];

	const handleTargetChange = (event) => {
		const selected = event.target.value;
		updateForm({
			target_beneficiaries: selected.join(","),
		});
	};
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					fullWidth
					multiline
					label="Inclusive Period"
					name="inclusive_period"
					value={formValues.inclusive_period || ""}
					onChange={handleChange}
					required
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="target-beneficiaries-label">
						Target Beneficiaries{" "}
						{formValues.target_beneficiaries?.split(",").filter(Boolean)
							.length === 0 && (
							<span style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
								Can select multiple
							</span>
						)}
					</InputLabel>
					{formValues.geographical_coverage
						? formValues.geographical_coverage.split(",").filter(Boolean)
						: []}
					<Select
						multiple
						labelId="target-beneficiaries-label"
						value={
							formValues.target_beneficiaries
								? formValues.target_beneficiaries.split(",").filter(Boolean)
								: []
						}
						onChange={handleTargetChange}
						input={<OutlinedInput label="Target Beneficiaries" />}
					>
						<MenuItem value="General Public">General Public</MenuItem>
						<MenuItem value="Women">Women</MenuItem>
						<MenuItem value="Children">Children</MenuItem>
						<MenuItem value="Solo Parents">Solo Parents</MenuItem>
						<MenuItem value="PWDs">PWDs</MenuItem>
						<MenuItem value="MSMEs">MSMEs</MenuItem>
						<MenuItem value="Others">Others</MenuItem>
						<MenuItem value="Labor Trade">Labor Trade</MenuItem>
						<MenuItem value="Industry">Industry</MenuItem>
						<MenuItem value="Economic Enterprises">
							Economic Enterprises
						</MenuItem>
						<MenuItem value="Environmental Protection & Ecology">
							Environmental Protection & Ecology
						</MenuItem>
						<MenuItem value="Family">Family</MenuItem>
						<MenuItem value="Human Resource Management & Development">
							Human Resource Management & Development
						</MenuItem>
						<MenuItem value="Finance">Finance</MenuItem>
						<MenuItem value="Infrastructure & General Services">
							Infrastructure & General Services
						</MenuItem>
						<MenuItem value="Education">Education</MenuItem>
						<MenuItem value="Tourism">Tourism</MenuItem>
						<MenuItem value="Arts & Investment Promotion">
							Arts & Investment Promotion
						</MenuItem>
						<MenuItem value="Peace & Order">Peace & Order</MenuItem>
						<MenuItem value="Public Safety">Public Safety</MenuItem>
						<MenuItem value="Elderly & Veterans">Elderly & Veterans</MenuItem>
						<MenuItem value="Cooperatives">Cooperatives</MenuItem>
						<MenuItem value="Transportation & Communication">
							Transportation & Communication
						</MenuItem>
						<MenuItem value="Laws and Good Governance">
							Laws and Good Governance
						</MenuItem>
						<MenuItem value="Health & Sanitation">Health & Sanitation</MenuItem>
						<MenuItem value="Barangay Affairs">Barangay Affairs</MenuItem>
						<MenuItem value="Disaster Preparedness & Resiliency">
							Disaster Preparedness & Resiliency
						</MenuItem>
						<MenuItem value="Youth(Sports & Development)">
							Youth(Sports & Development)
						</MenuItem>
					</Select>
				</FormControl>
			</Grid>

			<Grid item xs={12}>
				<FormControl fullWidth required>
					<InputLabel id="geographical-coverage-label">
						Geographical Coverage
					</InputLabel>
					<Select
						labelId="geographical-coverage-label"
						multiple
						value={
							formValues.geographical_coverage
								? formValues.geographical_coverage.split(",").filter(Boolean)
								: []
						}
						onChange={handleGeographicalChange}
						input={<OutlinedInput label="Geographical Coverage" />}
						renderValue={(selected) => (
							<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
								{selected.map((value) => (
									<Chip key={value} label={value} />
								))}
							</div>
						)}
					>
						{barangays.map((barangay) => (
							<MenuItem key={barangay} value={barangay}>
								{barangay}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default Step2;
