import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import HomeLayout from "./layout/HomeLayout";

function App() {
	return (
		<HomeLayout>
			<Heading>Futo</Heading>
			<Heading>Academia</Heading>

			<Text>An Open Source assessment platfrom, leveraging machine learning and natural language processing technologies to provide fast assessment and grading solutions for academic institutions.</Text>

			<Flex>
				<Button>Log In</Button>
				<Button colorScheme="brand">Sign Up</Button>
			</Flex>
		</HomeLayout>
	);
}

export default App;
