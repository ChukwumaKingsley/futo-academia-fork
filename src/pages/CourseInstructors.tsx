import { useParams } from "react-router-dom";
import CourseTabs from "../layout/CourseTabs";
import { useQuery } from "@tanstack/react-query";
import http from "../utils/http";
import { Avatar, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Loader from "../components/Loaders";
import { useState } from "react";
import { useAcceptInstructorRequest, useDeleteInstructorRequest } from "../hooks/useEnrollments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPortrait, faTrashAlt } from "@fortawesome/free-solid-svg-icons";


export default function CourseInstructors() {
	const { id } = useParams();
	const [coordinatorsList, setCoordinatorsList] = useState<any>([])
	const [instructorsList, setInstructorsList] = useState<any>([])
	const [requestsList, setRequestsList] = useState<any>([])

	const { isLoading: coordinatorLoading } = useQuery({
		queryKey: ["getCoordinators", id],
		queryFn: () => http.get(`/instructors/coordinators/${id}`).then((r) => r.data),
    onSuccess: (data) => {
		setCoordinatorsList(data)
    },
	});

	const { isLoading: instructorLoading } = useQuery({
		queryKey: ["getInstructors", id],
		queryFn: () => http.get(`/instructors/${id}`).then((r) => r.data),
    onSuccess: (data) => {
		setInstructorsList(data)
    },
	});

	const { isLoading: requestsLoading } = useQuery({
		queryKey: ["getRequests", id],
		queryFn: () => http.get(`/instructors/requests/${id}`).then((r) => r.data),
    onSuccess: (data) => {
		setRequestsList(data)
    },
	});

	const { data: enrollment_status } = useQuery({
		queryKey: ["getEnrollmentStatus", id],
		queryFn: () => http.get(`/courses/${id}/enrollment_status`).then((r) => r.data),
	});


	const deleteInstructorMutation = useDeleteInstructorRequest()
	const handleReject = (index: number) => {
		const newArray = [...requestsList.slice(0, index), ...requestsList.slice(index + 1)];
		deleteInstructorMutation.mutate({course_code: id, id: requestsList[index].instructor_id})
		setRequestsList(newArray)
	}

	const acceptInstructorRequestMutation = useAcceptInstructorRequest()
	const handleAccept = (index: number) => {
		const newArray = [...requestsList.slice(0, index), ...requestsList.slice(index + 1)];
		acceptInstructorRequestMutation.mutate({course_code: id, id: requestsList[index]?.instructor_id})
		setInstructorsList([...instructorsList, requestsList[index]])
		setRequestsList(newArray)
	}
	const handleRemove = (index: number) => {
		const newArray = [...instructorsList.slice(0, index), ...instructorsList.slice(index + 1)];
		deleteInstructorMutation.mutate({course_code: id, id: instructorsList[index]?.instructor_id})
		setInstructorsList(newArray)
	}



	return (
		<CourseTabs>
			<Heading mt={5} fontSize={{base: "16", md: "20"}} textColor={"white"}bg={"#343680"} p={2}>Coordinators</Heading>
			{
				coordinatorLoading ? <Loader height={"100px"} /> :
				coordinatorsList?.length >= 1 ?
				<Flex flexDir={"column"}>
					{coordinatorsList?.map((coordinator: any, index: number) => 
					<Flex p={3} bg={index%2 === 0 ? "#E0E0E066" : "unset"} columnGap={1} key={index} alignItems={"center"}>
						<Avatar src={coordinator?.photo_url} name={coordinator?.name} />
						<Text>{coordinator?.title}</Text>
						<Text>{coordinator?.name}</Text>
						<Text>({coordinator?.department})</Text>
						<Spacer />
						{coordinator?.is_current_user && <Text textColor={"#575AD4"}><FontAwesomeIcon  size="lg" icon={faPortrait} /></Text>}
					</Flex>
					)}
				</Flex> :
				<Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Data here</Text>
			}
			<Heading mt={5} fontSize={{base: "16", md: "20"}} textColor={"white"}bg={"#343680"} p={2}>Instructors</Heading>
			{
				instructorLoading ? <Loader  height={"100px"} /> :
				instructorsList?.length >= 1 ?
				<Flex flexDir={"column"}>
					{instructorsList?.map((instructor: any, index: number) => 
					<Flex p={3} bg={index%2 === 0 ? "#E0E0E066" : "unset"} columnGap={1} key={index} alignItems={"center"}>
						<Avatar src={instructor?.photo_url} name={instructor?.name} />
						<Text>{instructor?.title}</Text>
						<Text>{instructor?.name}</Text>
						<Text>({instructor?.department})</Text>
						<Spacer />
						{instructor?.is_current_user && <Text textColor={"#575AD4"}><FontAwesomeIcon  size="lg" icon={faPortrait} /></Text>}
						{enrollment_status?.is_course_coordinator && <Text cursor={"pointer"} color="red" size={"sm"}
						onClick={() => handleRemove(index)}><FontAwesomeIcon icon={faTrashAlt} /></Text>}
					</Flex>
					)}
				</Flex> :
				<Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Data here</Text>
			}
			{enrollment_status?.is_course_coordinator && <><Heading mt={5} fontSize={{base: "16", md: "20"}} textColor={"white"}bg={"#343680"} p={2}>Requests</Heading>
			{
				requestsLoading ? <Loader  height={"100px"} /> :
				requestsList?.length >= 1 ?
				<Flex flexDir={"column"}>
					{requestsList?.map((instructor: any, index: number) => 
					<Flex p={3} bg={index%2 === 0 ? "#E0E0E066" : "unset"} columnGap={1} key={index} alignItems={"center"}>
						<Avatar src={instructor?.photo_url} name={instructor?.name} />
						<Text>{instructor?.title}</Text>
						<Text>{instructor?.name}</Text>
						<Text>({instructor?.department})</Text>
						<Spacer />
						<Text cursor={"pointer"} color="green" size={"sm"}
						onClick={() => handleAccept(index)}><FontAwesomeIcon icon={faCheckCircle} /></Text>
						<Text cursor={"pointer"} color="red" size={"sm"}
						onClick={() => handleReject(index)} ml={5}><FontAwesomeIcon icon={faTrashAlt} /></Text>
					</Flex>
					)}
				</Flex> :
				<Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}>No Data here</Text>
			}</>}
		</CourseTabs>
	);
}
