import { useNavigate, useParams } from "react-router-dom";
import AssessmentCard from "../components/AssessmentCard";
import CourseTabs from "../layout/CourseTabs";

import { Box, Text, Input, Select, Button, useToast, FormLabel, FormControl, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from "@chakra-ui/react";

import http from "../utils/http";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import Loader from "../components/Loaders";

import { useUser } from "../hooks/useUser";
import { handleToast } from "../utils/handleToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";


export interface ExamSetup {
	assessment_type: string,
	course_id: string | undefined,
	duration: string,
	end_date: string,
	is_active: boolean, 
	start_date: string,
	title: string,
	total_mark: string
}

export default function Assignments() {
	const { id } = useParams();
	const toast = useToast();
	const navigate = useNavigate();
	const { isOpen, onClose, onOpen } = useDisclosure()
	const [data, setData] = useState<any>([])


	const { isLoading, refetch } = useQuery({
		queryKey: ["getassesments", id],
		queryFn: () => http.get(`/courses/${id}/assessments`).then((r) => r.data),
		onSuccess: (data: any) => setData(data),
		onError: (err) => console.log("error", err),
	});

	useEffect(() => {
		const arrangedData = data?.sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
		setData(arrangedData)
	}, [data])
	


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

	const handleChange = (e: any) => {
		setExamSetUp({ ...examSetUp, [e?.target?.name]: e?.target?.value });
	};
	
	const queryClient = useQueryClient();

	const user = useUser();

	useEffect(() => {
		setExamSetUp({ ...examSetUp, course_id: id, is_active: false });
	}, []);

	const automaticEndAssessmentMutation = useMutation({
		mutationFn: (id: any) => {
			return http.put(`/assessments/${id}/end-automatic`)
		},
		onError: (err: any) => (
			console.log(err)
		)
	})

	useEffect(() => {
		for (let i = 0; i<data?.length; i++) {
			automaticEndAssessmentMutation.mutate(data[i].id)
		}
		refetch()
	}, [new Date().getMinutes()]);

	const examSetUpMutation = useMutation({
		mutationFn: (examSetUp: ExamSetup) => {
			return http.post("/assessments", examSetUp);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			onClose()
			setExamSetUp({
				assessment_type: "",
				course_id: "",
				duration: "",
				end_date: "",
				is_active: false,
				start_date: "",
				title: "",
				total_mark: "",
			});
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

	const markMutation = useMutation({
		mutationFn: (id) => {
			return http.post(`/marks/${id}/`);
		},
		onSuccess: () => {
			toast({ title: "Sucessfully mark", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			setExamSetUp({
				assessment_type: "",
				course_id: "",
				duration: "",
				end_date: "",
				is_active: false,
				start_date: "",
				title: "",
				total_mark: "",
			});
		},
		onError: (err: any) => {
			console.log("Mark errr", err);
			handleToast(err);
		},
	});

	if (isLoading) return <Loader />;
	return (
		<CourseTabs>
			{user?.is_instructor && <Flex justifyContent={"end"} mt={"20px"} alignItems={"center"}>
				<Box onClick={() => {onOpen()}} fontSize={"16px"} display="flex" alignItems={"center"} cursor={"pointer"}>
				<FontAwesomeIcon icon={faPlusCircle} size="2x" color="#585AD4" fontSize={"16px"}/>
				<Text fontSize={"16px"} color="blue" mx={"10px"}>
					Create Assessment
				</Text>
				</Box>
			</Flex>}
			
			{user?.is_instructor && (
				<Box bgColor={"white"} mt={5}>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalCloseButton />
							<ModalBody>
								<Flex pt={8} alignItems={"center"} rowGap={"0.5rem"} flexDirection={"column"}>
									<Heading color={"brand.500"}>Create Assessment</Heading>
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
										examSetUpMutation.mutate(examSetUp);
									}}
									colorScheme="blue"
									isDisabled={Object.values(examSetUp).some(value => value == null || value === '')}
								>
									Setup
								</Button>
							</Box>
								</Flex>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Box>
			)}
			<Accordion defaultIndex={[0]} allowToggle>

				{user?.is_instructor && (
					<AccordionItem my={4} borderWidth={3}>
						<AccordionButton 
							display={"flex"} 
							justifyContent={"space-between"} 
							color={"#343780"}
							_expanded={{ bg: '#343680', color: 'white' }}
						>
							<Text fontWeight={"bold"} fontSize={"2xl"}>
								Drafts
							</Text>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel>
							{data
								?.filter((x: any) => !x?.is_marked && !x?.is_active && !x?.is_completed)
								?.map((x: any, i: number) => {
									return <AssessmentCard is_active={false} setExamSetUp={setExamSetUp} idx={id} key={i} {...x} data={x}/>;
								})}
							{data?.filter((x: any) => x?.is_marked === false && x?.is_active === false && x?.is_completed === false)?.length === 0 && <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Drafts</Text>}
						</AccordionPanel>
					</AccordionItem>
				)}

				<AccordionItem my={4} borderWidth={3}>
					<AccordionButton 
						display={"flex"} 
						justifyContent={"space-between"}
						color={"#343780"}
						_expanded={{ bg: '#343680', color: 'white' }}
					>
						<Text fontWeight={"bold"} fontSize={"2xl"}>
							Active
						</Text>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						{data
						?.filter((x: any) => x?.is_active)
						.map((x: any, i: number) => {
							return <AssessmentCard is_active={true} data={x} markMutation={markMutation} idx={id} key={i} setExamSetUp={setExamSetUp} {...x} />;
						})}
						{data?.filter((x: any) => x?.is_active)?.length === 0 && <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Active Assessment</Text>}
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem my={4} borderWidth={5}>
					<AccordionButton
						display={"flex"} 
						justifyContent={"space-between"}
						color={"#343780"}
						_expanded={{ bg: '#343680', color: 'white' }}
					>
					<Text fontWeight={"bold"} fontSize={"2xl"}>
						Completed
					</Text>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel>
					{data
						?.filter((x: any) => x?.is_completed && !x?.is_marked)
						.map((x: any, i: number) => {
							return (
								<AssessmentCard
									idx={id}
									setExamSetUp={setExamSetUp}
									overAllClick={() => (!user?.is_instructor ? navigate(`/exam/${x?.id}/${id}/results`) : "")}
									is_marked={true}
									key={i}
									{...x}
									data={x}
								/>
							);
						})}
					{data?.filter((x: any) => x?.is_completed && !x?.is_marked)?.length === 0 && <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Completed Assessment</Text>}
				</AccordionPanel>
				</AccordionItem>

				<AccordionItem my={4} borderWidth={5}>
					<AccordionButton
						display={"flex"} 
						justifyContent={"space-between"}
						color={"#343780"}
						_expanded={{ bg: '#343680', color: 'white' }}
					>
					<Text fontWeight={"bold"} fontSize={"2xl"}>
						Marked
					</Text>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel>
					{data
						?.filter((x: any) => x?.is_marked)
						.map((x: any, i: number) => {
							return (
								<AssessmentCard
									idx={id}
									setExamSetUp={setExamSetUp}
									overAllClick={() => (!user?.is_instructor ? navigate(`/courses/assessment/${x?.id}/${id}/results`) : navigate(`/courses/${id}/assessment/result/${x?.id}`))}
									is_marked={true}
									key={i}
									{...x}
									data={x}
								/>
							);
						})}
					{data?.filter((x: any) => x?.is_marked)?.length === 0 && <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Marked Assessments</Text>}
				</AccordionPanel>
				</AccordionItem>

			</Accordion>
		</CourseTabs>
	);
}
