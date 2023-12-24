import { Box, Flex, Link, List, ListItem, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useUser } from "../hooks/useUser";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LogoutAlert } from "../components/LogoutAlert";


const SidebarLecturer = () => {
	const user = useUser();
	const { isOpen: alertIsOpen, onClose: alertOnClose, onOpen: alertOnOpen} = useDisclosure();

	const [activeItem, setActiveItem] = useState("");
	const location = useLocation();

	// update activeItem based on current location
	useEffect(() => {
		if (location.pathname === "/lecturer-profile") {
			setActiveItem("profile");
		} else if (location.pathname === "/lecturer/home") {
			setActiveItem("home");
		} else if (location.pathname === "/lecturer/my-courses" || location.pathname.includes("courses") || location.pathname.startsWith("/lecturer/my-courses")) {
			setActiveItem("courses");
		}
	}, [location]);

	// define active and inactive colors
	const activeBackgroundColor = "#696CFF";

	// set style for active link
	const activeLinkStyle = {
		backgroundColor: activeBackgroundColor,
		textDecoration: "none",
		color: "#fff",
		transition: ".5s ease",
	};

	return (
		<Box  p="30px" display={{base: "none", md: "block"}} >
			<Stack flexDir="row" justify="center" mb="20" textAlign={"center"}>
				<Text fontWeight="bold" fontSize="30px" color={"#696CFF"} textAlign={"center"} textTransform={"capitalize"}>
					{user?.title} {user?.name}
				</Text>
			</Stack>

			<List spacing="2">
			<ListItem padding={"10px"} mb={4} style={activeItem === "home" ? activeLinkStyle : {}}>
					<Link href="/lecturer/home" sx={{ textDecoration: "none" }}>
						<Flex alignItems={"center"}>
							<Flex sx={{ marginRight: "25px" }}><FontAwesomeIcon icon={faHome} /></Flex>
							Home
						</Flex>
					</Link>
				</ListItem>
				<ListItem padding={"10px"} mb={4} style={activeItem === "courses" ? activeLinkStyle : {}}>
					<Link href="/lecturer/my-courses" sx={{ textDecoration: "none" }}>
						<Flex alignItems={"center"}>
							<AutoStoriesOutlinedIcon sx={{ marginRight: "20px" }} />
							Courses
						</Flex>
					</Link>
				</ListItem>
				<ListItem padding={"10px"} mb={4} style={activeItem === "profile" ? activeLinkStyle : {}}>
					<Link href="/lecturer-profile">
						<Flex alignItems={"center"}>
							<PersonOutlineOutlinedIcon sx={{ marginRight: "20px" }} />
							Profile
						</Flex>
					</Link>
				</ListItem>
			</List>

			<Flex mt="20" padding={"10px"} cursor={"pointer"}>
				<LogoutRoundedIcon sx={{ marginRight: "20px" }} />
				<Text onClick={alertOnOpen}>Logout</Text>
			</Flex>
			<LogoutAlert alertIsOpen={alertIsOpen} alertOnClose={alertOnClose} />
		</Box>
	);
};

export default SidebarLecturer;
