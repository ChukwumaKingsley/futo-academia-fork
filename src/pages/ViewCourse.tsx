import http from "../utils/http";
import { Box, Text, Flex, Skeleton, Stack, Modal, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, ModalOverlay, ModalContent, Button, Grid, GridItem, Table, TableContainer, Tbody, Th, Thead, Tr, Td } from "@chakra-ui/react";
import TimerBox from "../components/TimerBox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import CourseTabs from "../layout/CourseTabs";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";

import Countdown, { zeroPad } from "react-countdown";
import { useToast } from "@chakra-ui/react";

export default function ViewCourse() {
	const navigate = useNavigate();
	const user = useUser();
	const { id } = useParams();
	const [activeAssessments, setActiveAssessments] = useState<any>([])
	const [modalsStates, setModalsStates] = useState<boolean[]>([])
	const toast = useToast();
	
	const [timer, setTimer] = useState(false)

	const { data: enrolled, isLoading: statusLoading } = useQuery({
		queryKey: ["getEnrollmentStatus", id],
		queryFn: () => http.get(`/courses/${id}/enrollment_status`).then((r) => r.data),
		enabled: !user?.isLoading
	});

	const { isLoading, refetch } = useQuery({
		queryKey: ["getAssessments", id],
		queryFn: () => http.get(`/courses/${id}/assessments`, {
			params: {
			is_active: true,
			},
		  }).then((r) => r.data),
		onSuccess(data) {
			setActiveAssessments(data?.sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()))
				
				setModalsStates([...Array(activeAssessments.length).fill(false)]);
		},
		enabled: !statusLoading && (enrolled?.is_course_instructor || enrolled?.is_course_coordinator || enrolled?.is_enrolled)
	});

	const { data: courseResultsStats } = useQuery({
		queryKey: ["courseResultsStats", id],
		queryFn: () => http.get(`/courses/assessments_results_stats/${id}`, {
			params: {
			is_marked: true,
			},
		  },).then((r) => r.data),
		  enabled: !user.isLoading && user.is_instructor && !statusLoading && (enrolled?.is_course_instructor || enrolled?.is_course_coordinator || enrolled?.is_enrolled)
	});

	const { data: myResults } = useQuery({
		queryKey: ["my results", id],
		queryFn: () => http.get(`/courses/results/${id}/${user?.id}`,).then((r) => r.data),
		enabled: !user.isLoading && !user.is_instructor && !statusLoading && (enrolled?.is_course_instructor || enrolled?.is_course_coordinator || enrolled?.is_enrolled)
	});

	const onOpen = (index: number) => {
		const updatedModalsState = [...modalsStates];
		updatedModalsState[index] = true;
		setModalsStates(updatedModalsState);
	}
	const onClose = () => {
		setModalsStates([...Array(activeAssessments.length).fill(false)]);
	}

	const automaticEndAssessmentMutation = useMutation({
		mutationFn: (id: any) => {
			return http.put(`/assessments/${id}/end-automatic`)
		},
	})

	useEffect(() => {
		const intervalId = setInterval(() => {
		  // Iterate through active assessments and call the mutation
		  activeAssessments.forEach((assessment: any) => {
			automaticEndAssessmentMutation.mutate(assessment.id);
		  });
	  
		  // Refetch data
		  refetch();
		}, 60000); // Set the interval to 60 seconds (or adjust as needed)
	  
		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	  }, []);
	  

	const startTimerMutation = useMutation({
			mutationFn: async ({ course_code, assessment_id }: any) => {
					return await http.post(`/assessment_times/${course_code}/${assessment_id}`);
				},
				onSuccess: (data: any) => {navigate(`/exams/${id}/${data?.data?.assessment_id}`);},
			});

	const handleBegin = ({course_code, assessment_id}: any) => {
		startTimerMutation.mutate({course_code, assessment_id})
	}

	const header = [
		{
			title: "S/N",
			key: "s/n",
			align: "left",
		},
		{
			title: "Title",
			key: "title",
			align: "left",
		},
		{
			title: "Type",
			key: "type",
			align: "left",
		},
		{
			title: "Students (%)",
			key: "students",
			align: "right",
		},
		{
			title: "Avg. score(%)",
			key: "average score",
			align: "right",
		},
		{
			title: "Min",
			key: "minimum",
			align: "right",
		},
		{
			title: "Max",
			key: "maximum",
			align: "right",
		},
		{
			title: "Avg. time (mins)",
			key: "students",
			align: "right",
		},
	];

	const header2 = [
		{
			title: "S/N",
			key: "s/n",
			align: "left",
		},
		{
			title: "Title",
			key: "title",
			align: "left",
		},
		{
			title: "Type",
			key: "type",
			align: "left",
		},
		{
			title: "Score (%)",
			key: "score",
			align: "right",
		},
		{
			title: "Time (minutes)",
			key: "average score",
			align: "right",
		}
	];

	const renderer1 = ({ days, hours, minutes, seconds, completed }: any) => {
		if (completed) {
			setTimer(!timer)
		}
			return <TimerBox days={days} hours={hours} minutes={minutes} seconds={seconds} />;
	};
	const renderer2 = ({ days, hours, minutes, seconds, completed }: any) => {
		if (completed) {
			return (
				<Box
					sx={{
						border: "1px solid #B6B3C7",
					}}
					borderRadius="8px"
					p={4}
					my={2}
					width="20%"
				>
					<Text fontWeight={"bold"} textAlign={"center"}>
						Ended!
					</Text>
				</Box>
			);
		} else {
			return <TimerBox days={days} hours={hours} minutes={minutes} seconds={seconds} />;
		}
	};

	return (
		<>
			<CourseTabs>
				<Box>
					<Text fontSize="24px" color="#585AD4" fontWeight="bold" mt={10}>
						Currently up
					</Text>

					<Flex alignItems="flex-start" mt={3} flexDir={"column"} justifyContent={"space-between"} p={5} bg={"gray.200"}>
						{isLoading ? (
							<Stack>
								<Skeleton height="20px" />
								<Skeleton height="20px" />
								<Skeleton height="20px" />
							</Stack>
						):
						activeAssessments.length > 0 ? activeAssessments?.map((x: any, index: number) => (
							<Flex key={index} width={"100%"}>
								<Grid templateColumns={"repeat(10, 1fr)"} width={"100%"} alignItems={"center"} my={2} bg={"white"} p={3} columnGap={"2"} rowGap={"2"}>
									<GridItem colSpan={{base: 7, md: 4, lg: 5}} colStart={1} rowStart={1} justifySelf={"start"}>
										<Flex
											justifyContent="space-around"
											justifySelf={"start"}
										>
											<Box ml={2} display={"flex"} justifyContent={"space-around"} flexDir={"column"}>
												<Box fontWeight={"bold"}>
													{x?.title}{" "}
												</Box>
												<Box>({x?.assessment_type === "Exam" ? "Examination" : x?.assessment_type})</Box>
												{convertToEpoch(x?.start_date) > Math.floor(Date?.now()/1000) ? <Text color="#3578D3" fontSize={"sm"}>
													{new Date(x?.start_date).toDateString()}, {new Date(x?.start_date).getHours()}:{zeroPad(new Date(x?.start_date).getMinutes())} - {new Date(x?.end_date).toDateString()}, {new Date(x?.end_date).getHours()}:{zeroPad(new Date(x?.end_date).getMinutes())}
												</Text>
													:
												<Text color="#3578D3" fontSize={"sm"}>
													Ongoing
												</Text>
												}
											</Box>
										</Flex>
									</GridItem>
									
									<GridItem colSpan={{base: 10, md: 5, lg: 4}} display={'flex'} justifySelf={{base: "center", md: "end"}} >
										<Flex 
											justifyItems={"center"}
										>
											{convertToEpoch(x?.start_date) > Math.floor(Date?.now()/1000) && <Box gridColumn={{base: "span 10", md: "span 4"}} width={"100%"}><Countdown date={x?.start_date} renderer={renderer1} /></Box>}
											{convertToEpoch(x?.start_date) <= Math.floor(Date?.now()/1000) && <Box width={"100%"}><Countdown date={x?.end_date} renderer={renderer2} /></Box>}
										</Flex>
									</GridItem>

									<GridItem colSpan={{base: 3, md: 1}} rowStart={1} colStart={{base: 8, md: 10}} justifySelf={"end"}>
										<Flex>
										{
											user?.is_instructor ? 
											<Button
												fontWeight={"bold"}
												textAlign={"right"}
												variant={"outline"}
												colorScheme="blue"
												size={"sm"}
												onClick={() => navigate(`/courses/${x?.course_id}/assessment/${x?.id}`)}
											>
												View
											</Button>
											:
											<Button
												fontWeight={"bold"}
												textAlign={"right"}
												variant={"outline"}
												colorScheme="blue"
												size={"sm"}
												onClick={() => {
													if (convertToEpoch(x?.start_date) > Math.floor(Date?.now() / 1000)) {
														toast({
															title: "Assessment is yet to begin",
															position: "top"
														});
													} else {
														onOpen(index)
													}
												}}
											>
												Take
											</Button>
										}
										</Flex>
									</GridItem>

								</Grid>
								<Modal isOpen={modalsStates[index]} onClose={onClose} key={x?.id}>
									<ModalOverlay />
									<ModalContent>
									<ModalCloseButton />
										<ModalHeader borderBottom={"1px"} borderColor={"gray.200"}>
											<Text color="#3578D3">
												{x?.title} <i>({x?.assessment_type === "Exam" ? "Examination" : x?.assessment_type})</i>
											</Text>
										</ModalHeader>
										<ModalBody p={5} display={"flex"} flexDir={"column"}>
											<Flex alignSelf={"center"}>
												{convertToEpoch(x?.start_date) > Math.floor(Date?.now()/1000) && 
												<Countdown date={x?.start_date} renderer={renderer1} />}

												{convertToEpoch(x?.start_date) <= Math.floor(Date?.now()/1000) && 
												<Countdown date={x?.end_date} renderer={renderer2} />}
											</Flex>

											<Text mt={5}>Clicking <i>"Begin"</i> starts your timer for this {x?.assessment_type === "Exam" ? "Examination".toLowerCase() : x?.assessment_type.toLowerCase}.The {x?.assessment_type === "Exam" ? "Examination".toLowerCase() : x?.assessment_type.toLowerCase} will last for <b>{x?.duration}</b> minutes.</Text>
										</ModalBody>
										<ModalFooter>
											<Button 
												minWidth={"min-content"} 
												variant={"solid"} 
												colorScheme="blue"
												onClick={() => handleBegin({course_code: x?.course_id, assessment_id: x?.id})}
												isLoading={startTimerMutation.isLoading}
											>
												Begin
											</Button>
										</ModalFooter>
									</ModalContent>
								</Modal>
								</Flex>))
							:
							<Text alignSelf={"center"} textColor={"#696CFF"}>No active assessemnt</Text>
						}

					</Flex>
				</Box>

				{user?.is_instructor && (
					<>
						<Flex alignItems="center" justifyContent={"space-between"} columnGap={5} mt={8}>
						<Text fontSize="24px" color="#585AD4" fontWeight="bold" mt={5}>
							Results
						</Text>
					</Flex>
					<TableContainer mx="auto" mt={0}>
						<Table variant="striped">
							<Thead bgColor="brand.800" textColor="white">
								<Tr>
									{header.map((header: any) => (
										<Th
											key={header?.title}
											sx={{
												color: "#fff",
												textAlign: header?.align,
											}}
										>
											{header.title}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{courseResultsStats?.length > 0 ? courseResultsStats?.map((assessment: any, index: number) => 
								<Tr key={index} 
									cursor={"pointer"}
									_hover={{ transform: "scale(0.995)", transition: "transform 0.2s ease-in-out" }}
									onClick={() => navigate(`/courses/${id}/assessment/result/${assessment?.id}`)}
								>
									<Td>{index+1}</Td>
									<Td maxW={"200px"} overflowX={"hidden"}>{assessment?.title}</Td>
									<Td>{assessment?.type}</Td>
									<Td textAlign={"right"}>{assessment?.num_students} ({assessment?.percentage_submissions})</Td>
									<Td textAlign={"right"}>{assessment?.avg_score} ({assessment?.avg_score_percentage})</Td>
									<Td textAlign={"right"}>{assessment?.lowest_score}</Td>
									<Td textAlign={"right"}>{assessment?.highest_score}</Td>
									<Td textAlign={"right"}>{assessment?.avg_time}</Td>
								</Tr>):
								<Tr>
									<Td colSpan={8} textAlign={"center"}>
										<Text alignSelf={"center"} textColor={"#696CFF"}>
											No assessment results
										</Text>
									</Td>
								</Tr>}
								
							</Tbody>
						</Table>
					</TableContainer>
					</>
				)}

				{!user?.is_instructor && (
					<>
					<Flex alignItems="center" justifyContent={"space-between"} columnGap={5} mt={8}>
						<Text fontSize="24px" color="#585AD4" fontWeight="bold" mt={5}>
							Results
						</Text>
					</Flex>
					<TableContainer mx="auto" mt={0}>
						<Table variant="striped">
							<Thead bgColor="brand.800" textColor="white">
								<Tr>
									{header2.map((header: any) => (
										<Th
											key={header?.title}
											sx={{
												color: "#fff",
												textAlign: header?.align,
											}}
										>
											{header.title}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{myResults?.length > 0 ? myResults?.map((assessment: any, index: number) => 
								<Tr key={index} 
									cursor={"pointer"}
									_hover={{ transform: "scale(0.995)", transition: "transform 0.2s ease-in-out" }}
									onClick={() => navigate(`/courses/assessment/${assessment?.id}/${id}/results`)}
								>
									<Td>{index+1}</Td>
									<Td maxW={"200px"} overflowX={"hidden"}>{assessment?.title}</Td>
									<Td>{assessment?.type}</Td>
									<Td textAlign={"right"}>{assessment?.total_score} ({assessment?.total_percentage}%)</Td>
									<Td textAlign={"right"}>{assessment?.duration}</Td>
								</Tr>):
								<Tr>
								<Td colSpan={8} textAlign={"center"}>
									<Text alignSelf={"center"} textColor={"#696CFF"}>
										No assessment results
									</Text>
								</Td>
							</Tr>}
							</Tbody>
						</Table>
					</TableContainer>
					</>
				)}
			</CourseTabs>
		</>
	);
}

const convertToEpoch = (timestamp: any) => {
	const dt = new Date(timestamp);
	const epochTime = dt.getTime() / 1000;

	return Math.floor(epochTime);
};