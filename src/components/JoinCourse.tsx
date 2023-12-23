import { AddIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const JoinCourse = ({user}:{user: string}) => {
	const navigate = useNavigate();

	const handleJoinCourseClick = () => {
		navigate(`/${user}/home`);
	};
	return (
		<Box 
			sx={{ border: "4px solid green", margin: "auto", cursor: "pointer" }} 
			textAlign={"center"} 
			width={"100px"} 
			height={"100px"} 
			textColor={"green"} 
			onClick={handleJoinCourseClick} 
			padding="10px"
			>
			<AddIcon sx={{ fontSize: "25px" }} />
			<Text>Join course</Text>
		</Box>
	);
};

export default JoinCourse;
