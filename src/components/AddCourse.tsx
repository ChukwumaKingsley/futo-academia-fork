import { AddIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
	const navigate = useNavigate();

	const handleAddCourseClick = () => {
		navigate("/courses-upload");
	};
	return (
		<Box 
			sx={{ border: "4px solid #585AD4", margin: "auto", cursor: "pointer" }} 
			textAlign={"center"} 
			width={"100px"} 
			height={"100px"} 
			textColor={"#585ad4"} 
			onClick={handleAddCourseClick} 
			padding="10px"
			>
			<AddIcon sx={{ fontSize: "25px" }} />
			<Text>Create course</Text>
		</Box>
	);
};

export default AddCourse;
