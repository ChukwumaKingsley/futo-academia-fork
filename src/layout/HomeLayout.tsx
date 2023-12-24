import { Box, Button, Container, Flex, FormControl, FormLabel, Grid, Input, Text, Link, ListItem, UnorderedList, Spacer } from "@chakra-ui/react";
import Logo, { LogoWhite } from "../components/Logo";
import LoginModal from "../pages/Home/LoginModal";
import SignupModal from "../pages/Home/SignupModal";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import { WhatsAppIcon, TwitterIcon, LinkedInIcon, FacebookIcon } from "../components/Icons";
import { useUser } from "../hooks/useUser";

export default function HomeLayout({ children, height, styles }: { children: React.ReactNode; height?: string | number; styles?: React.CSSProperties }) {

	const navigate = useNavigate()
	const tokenCheck =  localStorage.getItem("token")

	if (tokenCheck) {
		const user = useUser()
		if (user?.is_instructor) {
			navigate('/lecturer/home')
		} else if (!user?.is_instructor) {
			navigate('/student/home')
		}
	}	

	const [isOpenSignUp, setIsOpenSignUp] = useState(false)
	const [isOpenLogin, setIsOpenLogin] = useState(false)

	const onOpenLogin = () => {setIsOpenLogin(true); setIsOpenSignUp(false)}
	const onOpenSignUP = () => {setIsOpenLogin(false); setIsOpenSignUp(true)}
	const onClose = () => {setIsOpenLogin(false); setIsOpenSignUp(false)}

	return (
		<Box backgroundColor={"#F3F6FF"} height={height} style={styles} display="flex" flexDir={"column"}>
			<Container maxW={"container.xl"}>
				<Flex paddingY={"2rem"} justifyContent={"space-between"}>
					<Logo />
					<Flex display={{ base: "none", md: "flex" }} columnGap={8}>
					<Button variant={"secondary"} onClick={onOpenLogin}>
						Login
					</Button>
					<Button colorScheme="brand" onClick={onOpenSignUP}>
						Signup
					</Button>
						<LoginModal isOpen={isOpenLogin} openSignUp={onOpenSignUP} onClose={onClose} />
						<SignupModal isOpen={isOpenSignUp} openLogin={onOpenLogin} onClose={onClose}/>
					</Flex>
				</Flex>
			</Container>

			{children}

			<Spacer />
			
			<Flex minHeight={"400px"} width={"100%"} paddingTop={{ base: "50px", md: "50px", lg: 0 }} bgColor={"brand.700"} alignItems={"center"} justifyItems={"center"} mt={10}>
				<Container maxW={"container.xl"}>
					<Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} rowGap={5} justifyItems={"center"}>
						<Box>
							<LogoWhite />

							<Text mt={8} color={"white"}>
								Join our social media pages
							</Text>

							<Grid width={"200px"} templateColumns={"1fr 1fr 1fr 1fr"} columnGap={0}>
								<WhatsAppIcon />
								<TwitterIcon />
								<LinkedInIcon />
								<FacebookIcon />
							</Grid>
						</Box>

						<Box as={"form"} display={"flex"} alignItems={"center"} justifySelf={"center"}>
							<Flex flexDir={"column"} alignItems={"center"}>
							<FormControl mb={2} alignSelf={"end"}>
								<FormLabel color={"white"} textAlign={"center"}>Subscribe to our newsletters</FormLabel>
								<Input bgColor={"white"} placeholder=" Input your e-mail" marginRight={"20px"} />
							</FormControl>
								<Button type="submit" maxW={"60px"} colorScheme="brand" variant="secondary" ml={"15px"} size={"xs"}>
									Subscribe
								</Button>
							</Flex>

						</Box>

						<UnorderedList display={{base: "flex", md: "flex", lg: "block"}} color={"white"} alignSelf={{ base: "left", lg: "center" }} flexDir={"row"} gridColumn={{base: "span 1", md: "span 2", lg: "span 1"}}>
							<ListItem marginRight={"30px"}>
								<Link as={RouterLink} to="/profile">
									About Us
								</Link>
							</ListItem>
							<ListItem marginRight={"30px"}>
								<Link as={RouterLink} to="/notifications">
									FAQ
								</Link>
							</ListItem>
							<ListItem>
								<Link as={RouterLink} to="/contact">
									Contact Us
								</Link>
							</ListItem>
						</UnorderedList>
					</Grid>
				</Container>
			</Flex>
		</Box>
	);
}
