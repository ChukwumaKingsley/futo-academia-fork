import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Button, Text, Flex, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";
import PasswordInput from "../../components/PasswordInput";
import useLogin from "../../hooks/useLogin";

export default function LoginModal({ isOpen, openSignUp, onClose }:{isOpen: boolean, openSignUp: () => void, onClose: () => void}) {

	const [user, setUser] = useState({
		username: "",
		password: "",
	});

	const loginMutation = useLogin();

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex pt={8} alignItems={"center"} rowGap={"0.5rem"} flexDirection={"column"}>
							<Heading color={"brand.500"}>Login </Heading>
							<Text>Please fill in your details</Text>

							<Flex my={8} alignItems={"center"} rowGap={"0.5rem"} flexDirection={"column"} as="form">
								<FormControl>
									<FormLabel textTransform={"uppercase"}>username</FormLabel>
									<Input
										type="text"
										id="username"
										name="username"
										autoComplete="name"
										required
										onChange={(e) => {
											setUser({
												...user,
												username: e.target.value,
											});
										}}
									/>
								</FormControl>

								<PasswordInput
									name="password"
									onChange={(e: any) => {
										console.log("Password", e.target.value);
										setUser({
											...user,
											password: e.target.value,
										});
									}}
								/>

								<Button my={6} w={"60%"} colorScheme="brand" isLoading={loginMutation.isLoading} onClick={() => loginMutation.mutate(user)} size={"lg"}>
									Continue
								</Button>
								<Flex>
									<Text>New User?</Text>
									<Button variant={"link"} onClick={openSignUp}>Sign up</Button>
								</Flex>
								<Flex>
									<Text>Forgot Password?</Text>
									<Button variant={"link"}>Click Here</Button>
								</Flex>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
