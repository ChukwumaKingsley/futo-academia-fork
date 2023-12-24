import { Flex, Box, Center, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import SidebarLecturer from "./SidebarLecturer";

export default function LecturerProfile() {

	const { pathname } = useLocation()

	return (
		<Box bgColor="#F3F6FF" h="max-content">
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<SidebarLecturer />
				<Box display={"flex"} flexDir={"column"} my={8} w="100%" p={"20px"} overflowY={"auto"}>
						<Center width={"70%"} maxWidth={"700px"}  minWidth={"300px"} alignSelf={"center"} height={"30px"} justifyContent={"space-around"} textAlign={"center"}>
							<Heading 
								as={NavLink} 
								to={"/lecturer-profile"}
								width={"50%"}
								size="24px"
								bg={ pathname === '/lecturer-profile' ? '#343680' : '#DAE4FF'}
								textColor={pathname === '/lecturer-profile' ? 'white' : '#585AD4'}
			 					>
								My Profile
							</Heading>
							<Heading 
								as={NavLink}
								to={"/lecturer-profile/password"}
								width={"50%"}
								size="24px" 
								bg={ pathname === '/lecturer-profile/password' ? '#343680' : '#DAE4FF'}
								textColor={pathname === '/lecturer-profile/password' ? 'white' : '#585AD4'}
							>
								Manage password
							</Heading>
						</Center>

						<Outlet />
						
				</Box>
			</Flex>
		</Box>
	);
}
