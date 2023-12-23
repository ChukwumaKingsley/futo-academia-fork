import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../utils/http";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Flex, FormControl, FormLabel, Grid, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Select, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useUser } from "../hooks/useUser";
import { ExamSetup } from "./Assignments";


export function deepEqual(obj1: any, obj2: any) {
	if (obj1 === obj2) return true;

	if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;
	
	for (let key of keys1) {
	  if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
		return false;
	  }
	}
  
	return true;
  }

export default function AssessmentHeader() {
	const { idx } = useParams();
	const user = useUser();
	const { isOpen, onClose, onOpen } = useDisclosure()
	const queryClient = useQueryClient();
	const toast = useToast()

	const [examSetUp, setExamSetUp] = useState<ExamSetup>({
		assessment_type: "",
		course_id: "",
		duration: "",
		end_date: "",
		is_active: false,
		start_date: "",
		title: "",
		total_mark: "",
	});
	const [currentExamInfo, setCurrentExamInfo] = useState<ExamSetup>({
		assessment_type: "",
		course_id: "",
		duration: "",
		end_date: "",
		is_active: false,
		start_date: "",
		title: "",
		total_mark: "",
	});

	const { data: assessmentData, isLoading: assessmentDataIsloading, refetch } = useQuery({
		queryKey: ["getAssessment", idx],
		queryFn: () => http.get(`/assessments/${idx}`).then((r) => r.data),
	});

	useEffect(() => {
	  setExamSetUp({
		assessment_type: assessmentData?.assessment_type,
		course_id: assessmentData?.course_id,
		duration: assessmentData?.duration,
		end_date: assessmentData?.end_date,
		is_active: assessmentData?.is_active,
		start_date: assessmentData?.start_date,
		title: assessmentData?.title,
		total_mark: assessmentData?.total_mark,
	})
	  setCurrentExamInfo({
		assessment_type: assessmentData?.assessment_type,
		course_id: assessmentData?.course_id,
		duration: assessmentData?.duration,
		end_date: assessmentData?.end_date,
		is_active: assessmentData?.is_active,
		start_date: assessmentData?.start_date,
		title: assessmentData?.title,
		total_mark: assessmentData?.total_mark,
	})
	}, [assessmentDataIsloading])

	
	const handleChange = (e: any) => {
		setExamSetUp({ ...examSetUp, [e?.target?.name]: e?.target?.value });
	};

	const examSetUpMutation = useMutation({
		mutationFn: (examSetUp: ExamSetup) => {
			return http.put(`/assessments/${assessmentData?.id}`, examSetUp);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			onClose()
			refetch()
		},
		onError: (err: any) => {
			if (err?.response) {
				toast({
					status: "error",
					description: err?.response?.data?.detail,
					position: "top"
				})
			}
		},
	});

	const editScheduleMutation = useMutation({
		mutationFn: (newSchedule: any) => {
			return http.put(`/assessments/edit-schedule/${assessmentData?.id}`, newSchedule)
		},
		onSuccess: () => {
			examSetUpMutation.mutate(examSetUp)
		},
		onError: (err: any) => {
			if (err?.response) {
				toast({
					status: "error",
					description: err?.response?.data?.detail,
					position: "top"
				})
			}
		},
	})

	
	return (
		<Box boxShadow={"md"} p={5} mt={1} display={"flex"} flexDir={"column"} alignItems={"center"} bg={'white'}>
			<Flex alignItems={"center"} p={1} gap={4}>
				<Text fontSize="24px" color="#585AD4" textAlign={"center"} fontWeight="bold">
					{examSetUp?.title}
				</Text>
				<Text bg={"#696CFF"} borderRadius={"full"} color="#FFF" px={2} minWidth={"min-content"} fontSize={"xs"}>{examSetUp?.assessment_type}</Text>
			</Flex>
			<Text fontSize="20px" color="#585AD4" textAlign={"center"} fontWeight="bold" mb={2}>
				({examSetUp?.course_id})
			</Text>
			<Divider />
			<Grid templateColumns={"1fr 3fr"} columnGap={3} alignSelf={"start"}mt={2}>
				<Text color={"#585ada"}>Begins:</Text>
				<Text>{new Date(examSetUp?.end_date).toLocaleDateString('en-US', { weekday: 'long' })}, {new Date(examSetUp?.start_date).toLocaleString()}</Text>
				<Text color={"#585ada"}>Ends:</Text>
				<Text>{new Date(examSetUp?.end_date).toLocaleDateString('en-US', { weekday: 'long' })}, {new Date(examSetUp?.end_date).toLocaleString()}</Text>
				<Text color={"#585ada"}>Duration:</Text>
				<Text>{examSetUp?.duration} minutes</Text>
			</Grid>
			{/* <Text>Course Code: {assessmentData?.course_id}</Text> */}
			<Text ml={"auto"} color={"#696CFF"} onClick={onOpen} cursor={"pointer"} _hover={{
                transform: "scale(1.05)",
                boxShadow: "md",
              }} transition="transform 0.3s, box-shadow 0.3s" bgColor={"transparent"}>Edit details</Text>

			{user?.is_instructor && (
				<Box bgColor={"white"} mt={5}>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalCloseButton />
							<ModalBody>
								<Flex pt={8} alignItems={"center"} rowGap={"0.5rem"} flexDirection={"column"}>
									<Heading color={"brand.500"}>Edit Assessment</Heading>
							<FormControl isRequired flexDir={"column"}>
								<FormLabel>Title</FormLabel>
								<Input
									placeholder="Assessment title"
									name="title"
									value={examSetUp["title"]}
									onChange={handleChange}
								/>
							</FormControl>
							<FormControl isRequired flexDir={"column"} my={1}>
								<FormLabel>Start date</FormLabel>
								<Input
									placeholder="Start Date"
									name="start_date"
									value={examSetUp["start_date"]}
									type="datetime-local"
									onChange={handleChange}
								/>
							</FormControl>
							<FormControl isRequired flexDir={"column"} my={1}>
								<FormLabel>End date</FormLabel>
								<Input
									placeholder="End date"
									name="end_date"
									value={examSetUp["end_date"]}
									type="datetime-local"
									onChange={handleChange}
								/>
							</FormControl>
							<FormControl isRequired flexDir={"column"} my={1}>
								<FormLabel>Duration (minutes)</FormLabel>
								<Input
									placeholder="60"
									name="duration"
									value={examSetUp["duration"]}
									type="number"
									onChange={handleChange}
								/>
							</FormControl>
							<FormControl isRequired flexDir={"column"} my={1}>
								<FormLabel>Total Mark</FormLabel>
								<Input
									placeholder="20"
									name="total_mark"
									value={examSetUp["total_mark"]}
									type="number"
									onChange={handleChange}
								/>
							</FormControl>
							<FormControl isRequired flexDir={"column"} my={1}>
								<FormLabel>Assessment type</FormLabel>
								<Select
									placeholder="Assesment type"
									name="assessment_type"
									value={examSetUp["assessment_type"]}
									onChange={handleChange}
								>
									<option value="Assignment">Assignment</option>
									<option value="Exam">Examination</option>
									<option value="Test">Test</option>
								</Select>
							</FormControl>

							<Box display="flex" alignSelf="end" gap={"10px"}>
								<Button
									onClick={() => {
										onClose()
									}}
									colorScheme="red"
								>
									Cancel
								</Button>
								<Button
									isLoading={examSetUpMutation.isLoading}
									onClick={() => {
										editScheduleMutation.mutate({start_date: examSetUp.start_date, end_date: examSetUp.end_date, duration: examSetUp.duration,
										course_id: examSetUp.course_id});
									}}
									colorScheme="blue"
									isDisabled={Object.values(examSetUp).some(value => value == null || value === '') || deepEqual(examSetUp,  currentExamInfo)}

								>
									Update
								</Button>
							</Box>
								</Flex>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Box>
			)}
		</Box>
	)
}
