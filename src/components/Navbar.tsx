import { Avatar, Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import Logo from "./Logo";
import Bell from "../assets/icons/bell.png";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { LogoutAlert } from "./LogoutAlert";

interface NavbarProps {
	bgColor: string;
}

export const handleLogout = () => {
	sessionStorage.clear();
	localStorage.clear();

	window.location.href = "/";
};

export default function Navbar({ bgColor }: NavbarProps) {
	const { isOpen: alertIsOpen, onClose: alertOnClose, onOpen: alertOnOpen} = useDisclosure();
	const user = useUser();
	const [userData, setUserData] = useState(user)
	useEffect(() => {
	  setUserData(user)
	}, [user.isLoading])

	
	
	return (
		<Container
			maxW={"100%"}
			sx={{
				bgColor: bgColor,
				zIndex: "999",
				position: "fixed",
				boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
			}}
		>
			<Flex paddingY={"1rem"} paddingX={"1rem"} justifyContent={"space-between"} alignItems={"center"}>
				<Logo />
				<Spacer />
				
				<Flex display={{ base: "none", md: "flex" }} columnGap={2} alignItems={"center"}>
					<Image src={Bell} boxSize="35px" />
					<Avatar src={userData.photo_url} name={userData.name} as={NavLink} to={"/lecturer-profile"}/>
				</Flex>

				<Flex alignItems={"center"} columnGap={2}>
					<Flex display={{ base: "flex", md: "none" }} columnGap={2}>
						<Text as={NavLink} to="student/home">Home</Text>
						<Text as={NavLink} to="/lecturer/my-courses">Courses</Text>
					</Flex>

					<Box gridArea={"faculty"} display={{ base: "flex", md: "none" }}>
						<Menu>
							<MenuButton 
								size={{ base: "sm", sm: "sm" }} 
								variant={"solid"} 
								colorScheme={"brand"} 
								color={"white"} 
								as={Button}
							>
								<HamburgerIcon />
							</MenuButton>
							<MenuList>
								<MenuItem justifyContent={"center"} borderBottomWidth={"1"} as={NavLink} to="/profile">
									Profile
								</MenuItem>
								<MenuItem justifyContent={"center"} >
									Notification
								</MenuItem>
								<MenuItem justifyContent={"center"} onClick={alertOnOpen} >
									Logout
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<LogoutAlert alertIsOpen={alertIsOpen} alertOnClose={alertOnClose}  />
		</Container>
	);
}
