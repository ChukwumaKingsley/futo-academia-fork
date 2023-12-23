import { Avatar, Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import styles from "./StudentDashboardLayout.module.css";
import Bell from "../assets/icons/bell.png";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { LogoutAlert } from "../components/LogoutAlert";

interface Props {
	children: React.ReactNode;
}

export default function StudentDashboardLayout({ children }: Props) {
	const user = useUser()

	const [userData, setUserData] = useState<any>({})
	const { isOpen: alertIsOpen, onClose: alertOnClose, onOpen: alertOnOpen} = useDisclosure();

	useEffect(() => {
	  setUserData(user)
	}, [user.isLoading])
	
	return (
		<Box>
			<Container maxW={"100vw"}>
				<Flex paddingY={"1rem"} justifyContent={"space-between"}>
					<Logo />
						<Flex alignItems={"center"} columnGap={2}>
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
											My Profile
										</MenuItem>
										<MenuItem justifyContent={"center"} borderBottomWidth={"1"} as={NavLink} to="/student/my-courses">
											My Courses
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
							<Flex display={{ base: "none", md: "flex" }} columnGap={3}>
								<Text as={NavLink} to="/student/my-courses">My Courses</Text>
								<Text onClick={alertOnOpen} cursor={"pointer"}>Logout</Text>
							</Flex>
							<Flex display={{base: "none", md: "flex"}} alignItems={"center"}>
								<Image src={Bell} boxSize="35px" />
								<Avatar src={userData.photo_url} name={userData.name} as={NavLink} to={"/student-profile"}/>
							</Flex>
						</Flex>
						<LogoutAlert alertIsOpen={alertIsOpen} alertOnClose={alertOnClose} />
				</Flex>
			</Container>

			{children}

			<svg width={"100vw"} style={{ height: 0 }}>
				<defs>
					<clipPath clipPathUnits="objectBoundingBox" id="clipPath">
						<path
							className={styles.path}
							d="M502.084 15.2655C280.068 -23.8234 58.0097 20.574 0 54.3549V482H1566.26V15.2655L1553 28.5L1539 39L1525.5 48.25L1505.5 60L1480.5 68C1471 72.5 1459.22 73.6067 1448.5 75.0764C1137 117.798 716.717 53.0545 502.084 15.2655Z"
							fill="#4648AA"
						/>
					</clipPath>
				</defs>
			</svg>
		</Box>
	);
}
