import React from "react";
import { WhiteBox } from "../Includes/styledComponents";
import EOForm from "../Components/EOForms";
import AddCoverageScope from "../Components/AddCoverageScope";

function Forms() {
	return (
		<WhiteBox>
			<EOForm />
			<AddCoverageScope />
		</WhiteBox>
	);
}

export default Forms;
