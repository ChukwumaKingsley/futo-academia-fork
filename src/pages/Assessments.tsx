import { Box, Input, Text, Flex } from "@chakra-ui/react";

import { AiOutlinePlus } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";

import CourseTabs from "../layout/CourseTabs";
import AssessmentCard from "../components/AssessmentCard";
import { useNavigate } from "react-router-dom";

export default function Assessments() {
	const navigate = useNavigate();
	return (
		<>
			<CourseTabs>
				<Box my={5}>
					<Input bgColor="#fff" placeholder="Search by Year" width="40%" />
					
					<Flex alignItems="center" mt={3}>
						<Text fontSize="24px" color="#585AD4" fontWeight="bold">
							Draft
						</Text>
						<Box ml={3} as={Flex} alignItems="center">
							<Box
								as="button"
								onClick={() => {
									navigate("add");
								}}
								width="40px"
								height="40px"
								cursor="pointer"
								borderRadius="50%"
								bgColor="#343780"
								alignItems="center"
								display="flex"
								justifyContent="center"
							>
								<AiOutlinePlus color="#fff" fontSize="30px" fontWeight="bold" />
							</Box>
							<Box width="40px" ml={2} cursor="pointer" height="40px" borderRadius="50%" bgColor="#343780" alignItems="center" display="flex" justifyContent="center">
								<BiPencil fontSize="30px" color="#fff" fontWeight="bold" />
							</Box>
						</Box>
					</Flex>
				</Box>

				<Box>
					<AssessmentCard />
					<AssessmentCard />
					<Box display="flex" alignItems="center" justifyContent="flex-end">
						<Text cursor="pointer">See all</Text>
					</Box>
				</Box>
				<Box>
					<Box display="flex" alignItems={"center"} justifyContent={"space-between"} my={5}>
						<Text fontSize="24px" color="#585AD4" fontWeight="bold">
							Concluded Tests
						</Text>
						<Text>A copy automatically gets saved in drafts after one month. </Text>
					</Box>
					<AssessmentCard />
					<AssessmentCard />
					<Box display="flex" alignItems="center" justifyContent="flex-end">
						<Text cursor="pointer">See all</Text>
					</Box>
				</Box>
			</CourseTabs>
		</>
	);
}
