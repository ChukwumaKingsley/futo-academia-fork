import { Box, Text, Modal, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, ModalOverlay, ModalContent, Button, useDisclosure, Flex, Menu, MenuButton, MenuList, MenuItem, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@chakra-ui/react";
import Countdown, { zeroPad } from "react-countdown";
import TimerBox from "./TimerBox";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function AssessmentCard({ is_active, title, id, idx, is_marked, is_completed, overAllClick, setExamSetUp, data }: Partial<any>) {
	const navigate = useNavigate();
	const user = useUser();
	const toast = useToast();
	const queryClient = useQueryClient();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: alertIsOpen, onClose: alertOnClose, onOpen: alertOnOpen} = useDisclosure();
	const [timer, setTimer] = useState(false)
	const [display, setDisplay] = useState(true)
	const cancelRef = useRef(null)

	const markMutation = useMutation({
		mutationFn: (id) => {
			return http.post(`/marks/${id}/`);
		},
		onSuccess: () => {
			toast({ title: "Sucessfully mark", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
		},
		onError: (err: any) => {
			toast({ title: err?.response?.data?.detail || err?.message });
		},
	});

	const uploadMutation = useMutation({
		mutationFn: (id) => {
			return http.put(`/assessments/${id}/activate`);
		},
		onSuccess: () => {
			toast({ title: "Sucessfully updated", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			setExamSetUp({});
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

	const deactivateMutation = useMutation({
		mutationFn: (id) => {
			return http.put(`/assessments/${id}/deactivate`);
		},
		onSuccess: () => {
			toast({ title: "Assessment deactivated", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			setExamSetUp({});
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
	const endAssessment = useMutation({
		mutationFn: (id) => {
			return http.put(`/assessments/${id}/end-manual`);
		},
		onSuccess: () => {
			toast({ title: "Assessment ended", variant: "solid" });
			queryClient.invalidateQueries({ queryKey: ["getassesments"] });
			setExamSetUp({});
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

	const startTimerMutation = useMutation({
		mutationFn: async ({ course_code, assessment_id }: any) => {
				return await http.post(`/assessment_times/${course_code}/${assessment_id}`);
			},
			onSuccess: (data: any) => {navigate(`/exams/${idx}/${data?.data?.assessment_id}`);},
		});

	const handleBegin = ({course_code, assessment_id}: any) => {
		startTimerMutation.mutate({course_code, assessment_id})
	}

	const deleteAssessment = useMutation({
		mutationFn: async ({ assessment_id }: any) => {
				return await http.delete(`/assessments/${assessment_id}`);
			},
			onSuccess: () => {setDisplay(false)},
		});

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
		{display && 
			<Box display="flex" my={4}>
				<Box bgColor="#fff" p={3} display="flex" alignItems="center" w="100%" justifyContent="space-between">
					<Box display="flex" flexDir="column" mr={2}>
						<Flex mb={2}>{title}<Text textColor={"#3578D3"} px={1} py={0} borderRadius={"20px"} >({data?.assessment_type === "Exam" ? "examination" : data?.assessment_type.toLowerCase()})</Text></Flex>
						
						{
							data?.is_completed ? 
							<Text color="#3578D3" fontSize={"sm"}>
								{new Date(data?.start_date).toDateString()}, {new Date(data?.start_date).getHours()}:{zeroPad(new Date(data?.start_date).getMinutes())} - {new Date(data?.end_date).toDateString()}, {new Date(data?.end_date).getHours()}:{zeroPad(new Date(data?.end_date).getMinutes())}
							</Text> :
						convertToEpoch(data?.start_date) > Math.floor(Date?.now()/1000) ? 
							<Text color="#3578D3" fontSize={"sm"}>
								{new Date(data?.start_date).toDateString()}, {new Date(data?.start_date).getHours()}:{zeroPad(new Date(data?.start_date).getMinutes())} - {new Date(data?.end_date).toDateString()}, {new Date(data?.end_date).getHours()}:{zeroPad(new Date(data?.end_date).getMinutes())}
							</Text>
							:
							<Text color="#3578D3" fontSize={"sm"}>
								Ongoing: ends {new Date(data?.end_date).toDateString()}, {new Date(data?.end_date).getHours()}:{zeroPad(new Date(data?.end_date).getMinutes())}
							</Text>
						}
					</Box>
	
					<Box display="flex" alignItems="center" justifyContent="space-between">
						{user?.is_instructor && !is_active && !is_marked && !is_completed && (
							<>
								<Menu>
								<MenuButton>
									<FontAwesomeIcon icon={faEllipsisV} size="lg" width={"3rem"}/>
								</MenuButton>
								<MenuList>
									<MenuItem 
										onClick={() => {
											navigate(is_active ? `/exams/${idx}/${id}` : `/courses/${idx}/assessment/${id}`);
										}}
									>
										<Text>View</Text>
									</MenuItem>
									<MenuItem
										onClick={() => navigate(`/courses/${idx}/assessment/add/${id}`)}
									>
										<Text>Edit</Text>
									</MenuItem>
									<MenuItem
										onClick={() => uploadMutation.mutate(id)}
									>
										<Text>Make Active</Text>
									</MenuItem>
									<MenuItem onClick={alertOnOpen}>
										<Text textColor={"red"}>Delete</Text>
									</MenuItem>
								</MenuList>
	
							</Menu>
							</>
						)}
						{user?.is_instructor && is_active && (
							<>
							<Menu>
								<MenuButton>
									<FontAwesomeIcon icon={faEllipsisV} size="lg" width={"3rem"}/>
								</MenuButton>
								<MenuList>
									<MenuItem 
										onClick={() => {
											navigate(`/courses/${idx}/assessment/add/${id}`);
										}}
									>
										<Text>Edit</Text>
									</MenuItem>
									<MenuItem
										onClick={() => navigate(`/courses/${idx}/assessment/${id}`)}
									>
										<Text>View</Text>
									</MenuItem>
									<MenuItem onClick={() => endAssessment.mutate(id)}>
										<Text>End</Text>
									</MenuItem>
									<MenuItem onClick={() => deactivateMutation.mutate(id)}>
										<Text>Move to drafts</Text>
									</MenuItem>
									<MenuItem  onClick={alertOnOpen}>
										<Text textColor={"red"}>Delete</Text>
									</MenuItem>
								</MenuList>
	
							</Menu>
							</>
						)}
						{!user?.is_instructor && is_active && (
							<>
								<Text
									as={NavLink}
									onClick={convertToEpoch(data?.start_date) > Math.floor(Date?.now()/1000) ? () => toast({
										title: "Assessment is yet to begin",
										position: "top"
									}) : onOpen}
									mr={2}
									cursor={"pointer"}
								>
									Take
								</Text>

								<Modal isOpen={isOpen} onClose={onClose}>
											<ModalOverlay />
											<ModalContent>
											<ModalCloseButton />
												<ModalHeader borderBottom={"1px"} borderColor={"gray.200"}>
													<Text color="#3578D3">
														{data?.title} <i>({data?.assessment_type === "Exam" ? "Examination" : data?.assessment_type})</i>
													</Text>
												</ModalHeader>
												<ModalBody p={5} display={"flex"} flexDir={"column"}>
												<Flex alignSelf={"center"}>
													{convertToEpoch(data?.start_date) > Math.floor(Date?.now()/1000) && 
													<Countdown date={data?.start_date} renderer={renderer1} />}
	
													{convertToEpoch(data?.start_date) <= Math.floor(Date?.now()/1000) && 
													<Countdown date={data?.end_date} renderer={renderer2} />}
	
												</Flex>
	
													<Text mt={5}>Clicking <i>"Begin"</i> starts your timer for this {data?.assessment_type === "Exam" ? "Examination".toLowerCase() : data?.assessment_type.toLowerCase}.The {data?.assessment_type === "Exam" ? "Examination".toLowerCase() : data?.assessment_type.toLowerCase} will last for <b>{data?.duration}</b> minutes.</Text>
												</ModalBody>
												<ModalFooter>
													<Button 
														minWidth={"min-content"} 
														variant={"solid"} 
														colorScheme="blue"
														onClick={() => handleBegin({course_code: data?.course_id, assessment_id: data?.id})}
														isLoading={startTimerMutation.isLoading}
													>
														Begin
													</Button>
												</ModalFooter>
											</ModalContent>
										</Modal>
							</>
						)}
						{user?.is_instructor && is_completed && !is_marked && (
							<>
							{markMutation.isLoading && <Text>Marking...</Text>}
								<Menu>
								<MenuButton>
									<FontAwesomeIcon icon={faEllipsisV} size="lg" width={"3rem"}/>
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => navigate(`/courses/${idx}/assessment/${id}`)}
									>
										<Text>View</Text>
									</MenuItem>
									<MenuItem onClick={() => markMutation.mutate(id)}>
										<Text>Mark</Text>
									</MenuItem>
								</MenuList>
							</Menu>
							</>
						)}
	
						{is_marked && !user?.is_instructor && overAllClick && <Button onClick={() => overAllClick()}>View Result</Button>}
						{is_marked && user?.is_instructor && overAllClick && <Button onClick={() => overAllClick()}>View Result</Button>}
						{user?.is_instructor &&
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
											<Button colorScheme="red" onClick={()=>{deleteAssessment.mutate({assessment_id: data?.id})}} size={"md"}>
												Delete
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialogOverlay>
							</AlertDialog>
						}
					</Box>
				</Box>
			</Box>
		}
		</>
	);
}

const convertToEpoch = (timestamp: any) => {
	const dt = new Date(timestamp);
	const epochTime = dt.getTime() / 1000;

	return Math.floor(epochTime);
};