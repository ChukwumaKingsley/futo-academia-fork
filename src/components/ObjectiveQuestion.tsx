import { Box, Flex, Input, Select, Text, Textarea, Button, useToast, Heading, FormControl, FormLabel, Center, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure } from "@chakra-ui/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../utils/http";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";

import { useRef, useState } from "react";
import ObjectiveAnswer from "./ObjectiveAnswer";
import { handleToast } from "../utils/handleToast";

export interface QuestionArr {
	id: string,
	question: string,
	mark: number | string,
	question_type: string,
	tolerance: number | string,
	is_multi_choice: boolean,
	num_answer: number,
	assessment_id: any,
}

export default function ObjectiveQuestion() {
	const navigate = useNavigate()
	const [questionChoice, setQuestionChoice] = useState("");
	const [openAnswer, setOpenAnswer] = useState(false);
	const [answers, setAnswers] = useState("");
	const [tolerence, setTolerance] = useState("");
	const [dataID, setDataID] = useState("");
	const cancelRef = useRef(null)
	const { isOpen: alertIsOpen, onClose: alertOnClose, onOpen: alertOnOpen} = useDisclosure();

	const { id, idx } = useParams();

	const toast = useToast();

	const queryClient = useQueryClient();

	const [questionArr, setQuestionArr] = useState<QuestionArr>({
		id: uuidv4(),
		question: "",
		mark: "",
		question_type: "",
		tolerance: questionChoice === "maths" ? tolerence : 0,
		is_multi_choice: false,
		num_answer: 0,
		assessment_id: idx,
	});

	const { data: answerData } = useQuery({
		queryKey: ["getAnswersss", idx],
		queryFn: () => http.get(`/assessments/${idx}/review`).then((r) => r.data),
		onError: (err) => handleToast(err),
	});

	const constructAnswer = (): any => {
		return {
			question_id: dataID,
			options: [
				{
					option: answers,
					is_correct: true,
				},
			],
		};
	};

	const uploadMutation = useMutation({
		mutationFn: (id: any) => {
			return http.put(`/assessments/${id}/activate`);
		},
		onSuccess: () => {
			toast({ title: "Sucessfully updated", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
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

	const questionMutations = useMutation({
		mutationFn: (question: QuestionArr) => {
			return http.post("/questions", question);
		},
		onSuccess: ({ data }) => {
			setDataID(data?.id);
			setOpenAnswer(true);
			toast({
				title: "Successful saved question",
			});
		},
		onError: (err) => {
			handleToast(err);
		},
	});

	const answersMutation = useMutation({
		mutationFn: (question: QuestionArr) => {
			return http.post("/answers", question);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getAnswersss"] });
			toast({
				title: "Successful saved answer",
			});
			setQuestionArr({
				id: uuidv4(),
				question: "",
				mark: "",
				question_type: "",
				tolerance: 0,
				is_multi_choice: false,
				num_answer: 0,
				assessment_id: idx,
			});
			setOpenAnswer(false);
			setDataID("");
		},
		onError: (err) => {
			handleToast(err);
		},
	});

	const handleChange = (e: any) => {
		setQuestionArr({ ...questionArr, [e?.target?.name]: e?.target?.value });
	};

	const deleteAssessment = useMutation({
		mutationFn: async ({ assessment_id }: any) => {
				return await http.delete(`/assessments/${assessment_id}`);
			},
			onSuccess: () => {navigate(`/courses/${id}/assessments`)},
			onError: (error: any) => {console.log(error)}
		});

	return (
		<>
			<Box>
				<Flex alignItems="center" justifyContent={"space-between"}>
					<Heading as={"h4"} size={"md"} mt={5}>
						Questions
					</Heading>
				</Flex>
				<Flex w="100%" justifyContent="space-around">
					{answerData?.questions.length === 0 && 
					<Text>No Questions</Text>}
					<Box width="100%">
						{answerData?.questions.map((x: any, i: number) => (
							<ObjectiveAnswer {...x} index={i + 1} key={i} />
						))}
					</Box>
				</Flex>
			</Box>
			<Box my={6} border="1px solid grey" p={4} borderRadius="8px">
				<Heading size={"md"} width={"100%"} textAlign={"center"} color={"#696CFF"}>Add Question</Heading>
				<Box>
					<FormControl my={2}>
						<FormLabel color={"black"}>Question</FormLabel>
						<Textarea bgColor="#fff" name="question" value={questionArr["question"]} onChange={handleChange} placeholder="Type Question here" />
					</FormControl>
					<FormControl>
						<FormLabel color={"black"}>Question Type</FormLabel>
						<Select
							placeholder="Select question type"
							bg={"#fff"}
							onChange={(e) => {
								setQuestionChoice(e?.target?.value);
								handleChange(e);
							}}
							name="question_type"
							value={questionArr["question_type"]}
						>
							<option value="obj">Objective</option>
							<option value="nlp">Theory</option>
							<option value="sub_obj">Subjective</option>
							<option value="maths">Maths</option>
						</Select>
					</FormControl>
					<FormControl my={2}>
						<FormLabel color={"black"}>Total Marks</FormLabel>
						<Input placeholder="Mark (in number)" name="mark" value={questionArr["mark"]} type="number" onChange={handleChange} bgColor={"white"} />
					</FormControl>

					<Box mt={3}>
						{questionChoice === "nlp" && openAnswer && 
						<FormControl>
							<FormLabel color={"black"}>Answer</FormLabel>
							<Textarea onChange={(e) => setAnswers(e?.target?.value)} placeholder="input answer" bgColor="white" />
						</FormControl>
						}
					</Box>
					<Box mt={3}>{questionChoice === "sub_obj" && openAnswer && <Textarea placeholder="input answer" onChange={(e) => setAnswers(e?.target?.value)} bgColor="white" />}</Box>
					<Box>
						{
						questionChoice === "obj" && openAnswer && 
						<ObjectiveComponent dataId={dataID} answersMutation={answersMutation} />
						}
					</Box>
					<Box>
						{questionChoice === "maths" && questionArr["question_type"] === "maths" && (
							<FormControl my={2}>
								<FormLabel  color={"black"}>Tolerance</FormLabel>
								<Input type="number" bgColor="white" placeholder="Tolerance" onChange={(e) => setTolerance(e?.target?.value)}  />
							</FormControl>
						)}
					</Box>
					<Box>{questionChoice === "maths" && openAnswer && 
						<FormControl my={4}>
							<FormLabel  color={"black"}>Answer</FormLabel>
							<Input type="number" onChange={(e) => setAnswers(e?.target?.value)} bgColor="white" placeholder="Maths Answer" />
						</FormControl>
						}</Box>
					<Box display="flex" alignItems="center" justifyContent="flex-end">
						{!dataID ? (
							<Button
								variant="solid"
								isLoading={questionMutations.isLoading}
								onClick={() => {
									console.log("Question Args", questionArr);
									questionMutations.mutate(questionArr);
								}}
								my={2}
								minWidth={"min-content"}
								colorScheme="blue"
								isDisabled = {questionArr.question === "" || questionArr.question_type === "" || questionArr.mark === ""}
							>
								Save Question
							</Button>
						) : (
							<>
								{questionChoice !== "obj" && (
									<Button isLoading={answersMutation.isLoading} onClick={() => answersMutation.mutate(constructAnswer())} my={2} minW={"min-content"} colorScheme="blue">
										Save answer
									</Button>
								)}
							</>
						)}
					</Box>
				</Box>
			</Box>

			<Center columnGap={3} mt={10}>
				<Button variant={"outline"} colorScheme="blue" onClick={() => {navigate(`/courses/${id}/assessments`)}}minWidth={"min-content"}>Done</Button>
				<Button variant={"solid"} colorScheme="blue" onClick={() => uploadMutation.mutate(idx)} minWidth={"min-content"}>Make Active</Button>
				<Button variant={"solid"} colorScheme="red" onClick={alertOnOpen} minWidth={"min-content"}>Delete assessment</Button>
			</Center>

			<AlertDialog 
				leastDestructiveRef={cancelRef} 
				isOpen={alertIsOpen} 
				onClose={alertOnClose}
					>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>
							Delete Assessment
						</AlertDialogHeader>
						<AlertDialogBody>
							Are you sure? This action cannot be undone!
						</AlertDialogBody>
						<AlertDialogFooter gap={2}>
							<Button ref={cancelRef} onClick={alertOnClose} size={"md"}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={()=>{deleteAssessment.mutate({assessment_id: id})}} size={"md"}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}

const ObjectiveComponent = ({ dataId, answersMutation }: any) => {
	const [a, setA] = useState("");
	const [b, setB] = useState("");
	const [c, setC] = useState("");
	const [d, setD] = useState("");

	const [correct, setCorrect] = useState("");

	const constructObject = () => {
		return {
			question_id: dataId,
			options: [
				{
					option: a,
					is_correct: Boolean(a === correct),
				},
				{
					option: b,
					is_correct: Boolean(b === correct),
				},
				{
					option: c,
					is_correct: Boolean(c === correct),
				},
				{
					option: d,
					is_correct: Boolean(d === correct),
				},
			],
		};
	};

	return (
		<Box>
			<Text fontWeight={"bold"}>Options</Text>
			<Flex alignItems="center" justifyContent="space-between" columnGap={2} flexDir={{base: "column", md: "row"}}>
				<Box w="100%" display={"flex"} alignItems={"center"} gap={2}>
					<Text fontWeight="bold">A.</Text>
					<Input bgColor="white" name="A" onChange={(e) => setA(e?.target?.value)} />
				</Box>
				<Box w="100%" display={"flex"} alignItems={"center"} gap={2}>
					<Text fontWeight="bold">B.</Text>
					<Input bgColor="white" name="B" onChange={(e) => setB(e?.target?.value)} />
				</Box>
			</Flex>
			<Flex alignItems="center" justifyContent="space-between" mt={3} columnGap={2} flexDir={{base: "column", md: "row"}}>
				<Box w="100%" display={"flex"} alignItems={"center"} gap={2}>
					<Text fontWeight="bold">C.</Text>
					<Input bgColor="white" name="C" onChange={(e) => setC(e?.target?.value)} />
				</Box>
				<Box w="100%" display={"flex"} alignItems={"center"} gap={2}>
					<Text fontWeight="bold">D.</Text>
					<Input bgColor="white" name="D" onChange={(e) => setD(e?.target?.value)} />
				</Box>
			</Flex>
			<Text my={3}>Question Answer</Text>
			<Select
				mt={3}
				placeholder="Correct Answer"
				bgColor="#fff"
				onChange={(e) => {
					setCorrect(e?.target?.value);
				}}
			>
				<option value={a}>A</option>
				<option value={b}>B</option>
				<option value={c}>C</option>
				<option value={d}>D</option>
			</Select>

			<Flex justifyContent={"right"}>
				<Button
					isLoading={answersMutation.isLoading}
					my={8}
					onClick={() => {
						answersMutation.mutate(constructObject());

						setCorrect("");
						setA("");
						setB("");
						setC("");
						setD("");
					}}
					minWidth={"min-content"}
					colorScheme="blue"
				>
					Save answer
				</Button>
			</Flex>
		</Box>
	);
};

// const PreviewQuestion = ({ question, mark, question_type }: any) => {
// 	return (
// 		<Box bgColor={"#fff"} my={2} p={3}>
// 			<Text fontSize={"2xl"}>Question: {question ?? "--"}</Text>
// 			<Text>Question Type: {question_type?.toUpperCase() ?? "--"}</Text>
// 			<Text>Mark: {mark ?? "--"}</Text>
// 		</Box>
// 	);
// };

// const PreviewAnswer = () => {
// 	return (
// 		<Box bgColor={"#fff"} my={2} p={3}>
// 			<Text fontSize={"2xl"}>Answer</Text>
// 			<Flex>
// 				<Text></Text>
// 			</Flex>
// 		</Box>
// 	);
// };
