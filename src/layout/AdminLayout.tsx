import { ReactNode } from "react";

import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./SidebarLecturer";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<Box bg={"#F3F6FF"} minH={"100vh"} width={"100%"}>
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<Sidebar />
				<Box my={8} sx={{width: "100%", padding: "1rem" }}>
					{children}
				</Box>
			</Flex>
		</Box>
	);
}
