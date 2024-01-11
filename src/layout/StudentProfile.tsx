import { Flex, Box, Center, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

export default function StudentProfile() {

	const { pathname } = useLocation()
	const user = useUser()

	useEffect(() => {
		if (user?.is_instructor) {
			window.location.href = "/lecturer-profile/"
		}

	}, [user.isLoading]);

	return (
		<Box bg={"#F3F6FF"} minHeight="100vh">
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<SidebarStudent />
				<Box display={"flex"} flexDir={"column"} my={8} w="100%" p={"20px"}>
						<Center width={"70%"} maxWidth={"700px"}  minWidth={"300px"} alignSelf={"center"} height={"30px"} justifyContent={"space-around"} textAlign={"center"}>
							<Heading 
								as={NavLink} 
								to={"/student-profile"}
								width={"50%"}
								size="24px"
								bg={ pathname === '/student-profile' ? '#343680' : '#DAE4FF'}
								textColor={pathname === '/student-profile' ? 'white' : '#585AD4'}
			 					>
								My Profile
							</Heading>
							<Heading 
								as={NavLink}
								to={"/student-profile/password"}
								width={"50%"}
								size="24px" 
								bg={ pathname === '/student-profile/password' ? '#343680' : '#DAE4FF'}
								textColor={pathname === '/student-profile/password' ? 'white' : '#585AD4'}
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
