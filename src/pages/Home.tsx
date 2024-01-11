import { Flex, Heading, Text, Box, Grid, Image, Button } from "@chakra-ui/react";
import HomeLayout from "../layout/HomeLayout";
import SignupModal from "./Home/SignupModal";
import students from "../assets/images/students.png";
import line1 from "../assets/bg-images/line1.png";
import line2 from "../assets/bg-images/line2.png";
import line3 from "../assets/bg-images/line3.png";
import line4 from "../assets/bg-images/line4.png";
import LoginModal from "./Home/LoginModal";
import { useState } from "react";

export default function Home() {

	const tokenCheck =  localStorage.getItem("token")
	if (tokenCheck) {
		window.location.href = "/student/home/"
	}

	const [isOpenSignUp, setIsOpenSignUp] = useState(false)
	const [isOpenLogin, setIsOpenLogin] = useState(false)

	const onOpenLogin = () => {setIsOpenLogin(true); setIsOpenSignUp(false)}
	const onOpenSignUP = () => {setIsOpenLogin(false); setIsOpenSignUp(true)}
	const onClose = () => {setIsOpenLogin(false); setIsOpenSignUp(false)}

	return (
		<HomeLayout
			height={"100vh"}
			styles={{
				backgroundImage: `url(${line1}), url(${line2}), url(${line3}), url(${line4})`,
				backgroundPosition: "-15% -15%, -24% -24%, 95% 95%, 120% 120%",
				backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
			}}
		>
			<Grid alignSelf={"center"} templateColumns={{ base: "1fr", md: "1fr 1fr" }} columnGap={"1rem"} justifyItems={{base: "center", md: "right"}} p={"20px 20px"} maxW={"1500px"}>
				<Box marginTop={12} marginLeft={{ base: 4, md: 10 }}>
					<Box mb={12}>
						<Heading color={"brand.500"} mb={"-30px"} fontSize={{ base: "80px", md: "120px" }}>
							Futo
						</Heading>
						<Heading color={"brand.500"} fontSize={{ base: "40px", md: "70px" }}>
							Academia
						</Heading>
					</Box>

					<Text mb={12}>An Open Source Website For FUTO students with Over 10,000 Courses, Professional degrees and Certificates</Text>

					<Flex columnGap={4}>
						<Button variant={"secondary"} onClick={onOpenLogin}>
							Login
						</Button>
						<Button colorScheme="brand" onClick={onOpenSignUP}>
							Signup
						</Button>
						<LoginModal isOpen={isOpenLogin} openSignUp={onOpenSignUP} onClose={onClose} />
						<SignupModal isOpen={isOpenSignUp} openLogin={onOpenLogin} onClose={onClose}/>
					</Flex>
				</Box>

				<Box
					gridRow={{base: 1, md: "auto"}}
					backgroundColor={"brand.500"}
					width={{ base: "90%", md: "350px", xl: "570px" }}
					borderRadius={{ base: "30px", md: "50px", xl: "98.1002px 98.1002px 49.0501px 49.0501px" }}
				>
					<Image src={students} alt="students standing" width={{ base: "400px", md: "450px", xl: "600px" }} />
				</Box>
			</Grid>
		</HomeLayout>
	);
}
