import { Box, Text, Flex, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import http from "../utils/http";
import AdminLayout from "../layout/AdminLayout";
import ObjectiveAnswer from "../components/ObjectiveAnswer";
import Loader from "../components/Loaders";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

export default function ExamResult() {
	const user = useUser()
	const navigate = useNavigate()
	const { id, idx } = useParams();

	useEffect(() => {
        if (user && user?.is_instructor) {
            navigate(`/courses/${idx}/assessment/result/${id}`)
        }
    }, [user])

	const { data, isLoading } = useQuery({
		queryKey: ["getRes", id],
		queryFn: () => http.get(`assessments/${id}/student_result/${user?.id}`),
		enabled: !user.isLoading && !user.is_instructor,
	});

	const { data: examData } = useQuery({
		queryKey: ["getCourseID", idx],
		queryFn: () => http.get(`/courses/${idx}`).then((r) => r.data),
	});

	const handleAns = (ans: any, type: any) => {
		if (type === "obj") {
			const val = ans?.answers?.find((x: any) => {
				return +x?.id === +ans?.stu_answers?.stu_answer_id;
			});
			return val?.option;
		}
		return ans?.stu_answers?.stu_answer;
	};

	if (isLoading) {
		return <Loader height="30%" />;
	}

	return (
		<AdminLayout>
			<Box bgColor={"#f3f6ff"} w="100%" minH={"100vh"} p={6} px={50}>
				<>
					<Text textAlign={"center"} color="#232455" fontWeight={"bold"}>
						Federal University of Technology Owerri <br /> FACULTY OF {examData?.faculty} <br /> {examData?.semester === 1 ? "HARMATTAN" : "RAIN"} SEMESTER {data?.data?.assessment_type.toUpperCase()} (2022/2023)
					</Text>
					<Text>
						<b>COURSE TITLE: </b>{examData?.title.toString().toUpperCase()}
					</Text>
					<Flex justifyContent={"space-between"}>
						<Text my={1}>
							{" "}
							<b>COURSE CODE:</b> {data?.data?.course_id}
						</Text>
						<Text my={1}>
							{" "}
							<b>DATE:</b> {data?.data?.start_date.split("T")[0]}
						</Text>
					</Flex>
					<Text my={1} textAlign={"center"}>
						<b>{data?.data?.title.toString().toUpperCase()}</b>
					</Text>
					<Flex justifyContent={"space-between"}>
						<Text my={1}>
							{" "}
							<b> NO OF CREDITS:</b> {examData?.units} UNITS
						</Text>
						<Text my={1}>
							<b>ALLOCATED TIME:</b> {data?.data?.duration} MINUTES
						</Text>
						
					</Flex>
					
				<Box>
					<Flex my={3} flexDir={"column"}>
						<Box width={"100%"} bg={"whiteAlpha.900"} p={5}>
							<Heading as={"h4"} size={"sm"}>
								<i>Instructions</i>
							</Heading>
							{data?.data?.instructions.length === 0 ? 
								<Text><i>No instructions.</i></Text>
								: 
								<UnorderedList>
									{data?.data?.instructions.map((instruction: any, index: number) => <ListItem key={index} my={2} boxShadow={"sm"}>
										<Flex gap={2} alignItems={"start"}>
											<Text>{instruction.instruction}</Text>
										</Flex>
									</ListItem>)}
								</UnorderedList>
							}
						</Box>
					</Flex>
				</Box>
				</>
				<Flex justifyContent={"space-between"}>
					<Text fontSize={"xl"}>End Date: {data?.data?.end_date.split("T")[0]}</Text>
					<Text fontSize={"xl"}>Start Date: {data?.data?.start_date.split("T")[0]}</Text>
				</Flex>

				<Box>
					<Text fontSize={"4xl"} mb={15} fontWeight={"black"}>
						Score: {data?.data?.total}/{data?.data?.total_mark}
					</Text>
				</Box>

				<Box>
					{data?.data?.questions?.map((x: any, i: number) => (
						<ObjectiveAnswer key={i} index={i + 1} {...x} studentAnswer={() => handleAns(x, x?.question_type)} />
					))}
				</Box>
			</Box>
		</AdminLayout>
	);
}
