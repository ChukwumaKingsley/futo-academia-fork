import { PropagateLoader } from "react-spinners";
import { Box } from "@chakra-ui/react";

const Loader = ({ height = "100vh" }: { height?: string }) => {
	return (
		<Box display="flex" alignItems="center" justifyContent="center" sx={{ height: height, width: "100%" }} marginTop={2}>
			<PropagateLoader color="#2574F5" />
		</Box>
	);
};

export default Loader;
