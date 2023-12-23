import http from "../utils/http";
import { Box, Text, Flex, Skeleton, Stack, Spacer } from "@chakra-ui/react";
import TimerBox from "../components/TimerBox";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CourseTabs from "../layout/CourseTabs";
import { useEffect } from "react";

import Countdown, { zeroPad } from "react-countdown";
import { useToast } from "@chakra-ui/react";

export default function ViewCourse() {
	
	const { id } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	const { data: enrolled, isLoading: enrolledIsLoading } = useQuery({
		queryKey: ["getEnrollmentStatus", id],
		queryFn: () => http.get(`/courses/${id}/enrollment_status`).then((r) => r.data),
	});

	useEffect(() => {
	  console.log(enrolled)
	}, [enrolledIsLoading])
	

	const { data: currUp, isLoading } = useQuery({
		queryKey: ["getCurrUp", id],
		queryFn: () => {
			const anyFalse = Object.values(enrolled).some(value => value === false);
			if (!anyFalse) {
				return http.get(`/courses/${id}/assessments`).then((r) => r.data)
			}
			}
	});




	useEffect(() => {
		console.log(
			"idddd",
			currUp?.filter((x: any) => x?.is_marked)
		);
		console.log(currUp)
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars



	const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
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
						Completed!
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

					<Flex alignItems="flex-start" mt={3} flexDir={"column"} justifyContent={"space-between"} p={5}>
						{isLoading ? (
							<Stack>
								<Skeleton height="20px" />
								<Skeleton height="20px" />
								<Skeleton height="20px" />
							</Stack>
						):
						currUp !== undefined ? currUp
							?.filter((x: any) => {
								return x?.is_active && !(Math.floor(Date?.now() / 1000) > convertToEpoch(x?.end_date));
							})
							?.map((x: any) => (
								<Flex alignItems={"center"} justifyContent={"space-between"} bg={"white"} w="100%" p={4} flexDir={{base: "column", md: "row"}}>
									<Flex
										flexDir={{base: "column", md: "row"}}
										justifyContent="space-around"
										cursor={"pointer"}
										onClick={() => {
											if (convertToEpoch(x?.start_date) > Math.floor(Date?.now() / 1000)) {
												toast({
													title: "Test is yet to start",
												});
											} else {
												navigate(`/exams/${id}/${x?.id}`);
											}
										}}
									>
										<Box ml={2} display={"flex"} justifyContent={"space-around"} flexDir={"column"}>
											<Box fontWeight={"bold"}>
												{x?.title}{" "}
											</Box>
											<Box>({x?.assessment_type === "Exam" ? "Examination" : x?.assessment_type})</Box>
											<Text color="#3578D3" fontSize={"sm"}>
												{new Date(x?.end_date).toDateString()}, {new Date(x?.end_date).getHours()}:{zeroPad(new Date(x?.end_date).getMinutes())}
											</Text>
										</Box>
									</Flex>
									<Spacer />
									<Text fontWeight={"bold"} width={"20%"} textAlign={"center"} p={3} borderLeft={"1px"} as={NavLink} to={`/lecturer/courses/${x?.course_id}/assessment/${x?.id}`}>View</Text>
									<Countdown date={x?.end_date} renderer={renderer} />
								</Flex>
							))
							: <Text>No active assessemnt</Text>
						}

					</Flex>
				</Box>
			</CourseTabs>
		</>
	);
}

const convertToEpoch = (timestamp: any) => {
	const dt = new Date(timestamp);
	const epochTime = dt.getTime() / 1000;

	return Math.floor(epochTime);
};
