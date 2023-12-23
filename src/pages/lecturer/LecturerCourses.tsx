import { Flex, Button, Box, Container, Spacer } from "@chakra-ui/react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

import JoinCourse from "../../components/JoinCourse";
import SidebarLecturer from "../../layout/SidebarLecturer";
import AddCourse from "../../components/AddCourse";

export default function LecturerCourses() {
	const { pathname } = useLocation()
	return (
		<Box bg={"#F3F6FF"} minH={"100vh"}>
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<SidebarLecturer />
				<Box my={8}  w={"100%"}>
					<Container w={"100%"} maxW={"73vw"} display={"flex"} flexDir={"column"}>
						<Flex my={8} justifyContent={"center"}>
							<Button
								width={"200px"}
								variant={pathname === "/lecturer/my-courses" ? "solid" : "ghost"}
								colorScheme="blue"
								as={NavLink}
								to={"/lecturer/my-courses"}
							>
								Harmattan
							</Button>
							<Button
								width={"200px"}
								variant={pathname === "/lecturer/my-courses/second-semester" ? "solid" : "ghost"}
								colorScheme="blue"
								as={NavLink}
								to={"/lecturer/my-courses/second-semester"}
							>
								Rain
							</Button>
						</Flex>

						<Outlet />
						<Spacer />
						<Flex maxWidth={"400px"} alignSelf={"center"} gap={'3'} mt={20}>
							<AddCourse />
							<JoinCourse user="lecturer"/>
						</Flex>
					</Container>
				</Box>
			</Flex>
		</Box>
	);
}
