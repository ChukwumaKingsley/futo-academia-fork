import { Flex, Button, Box, Container } from "@chakra-ui/react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

import JoinCourse from "../../components/JoinCourse";
import SidebarStudent from "../../layout/SidebarStudent";

export default function StudentCourses() {
	const { pathname } = useLocation()
	return (
		<Box bg={"#F3F6FF"} minH={"100vh"}>
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<SidebarStudent />
				<Box my={8}  w={"100%"}>
					<Container w={"100%"} maxW={"73vw"} display={"flex"} flexDir={"column"}>
						<Flex my={8} justifyContent={"center"}>
							<Button
								width={"200px"}
								variant={pathname === "/student/my-courses" ? "solid" : "ghost"}
								colorScheme="blue"
								as={NavLink}
								to={"/student/my-courses"}
							>
								Harmattan
							</Button>
							<Button
								width={"200px"}
								variant={pathname === "/student/my-courses/second-semester" ? "solid" : "ghost"}
								colorScheme="blue"
								as={NavLink}
								to={"/student/my-courses/second-semester"}
							>
								Rain
							</Button>
						</Flex>

						<Outlet />
 
						<Flex maxWidth={"400px"} alignSelf={"center"} gap={'3'}mt={5}>
							<JoinCourse user="student" />
						</Flex>
					</Container>
				</Box>
			</Flex>
		</Box>
	);
}
