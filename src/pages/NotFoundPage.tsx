import { Box, Flex, Text } from "@chakra-ui/react";
import Logo from "../components/Logo";
import EmptyIcon from "../assets/images/emptyfile.svg";
import { NavLink } from "react-router-dom";


export const NotFoundPage = () => {
    return (
		<Flex backgroundColor={"#F3F6FF"} flexDir={"column"} minH={"100vh"}>
            <Flex p={10} justifyContent={"space-between"}>
                <Logo />
            </Flex>
            <Box display={"flex"} mt={40} alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
              <Box>
                <img
                  src={EmptyIcon}
                  style={{
                    margin: "0 auto",
                  }}
                  alt="empty icon"
                  height={100}
                  width={100}
                />
                <Text fontWeight={"bold"} textAlign={"center"} mt={10} textColor={"brand.700"}>
                  Page Not Found. Go pack to <NavLink to={'/'}><u>Home Page</u></NavLink>.
                </Text>
              </Box>
            </Box>

        </Flex>
	);
}
