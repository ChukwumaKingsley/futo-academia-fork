import { useParams } from "react-router-dom"
import CourseTabs from "../layout/CourseTabs"
import { useUser } from "../hooks/useUser"
import http from "../utils/http"
import { useQuery } from "@tanstack/react-query"
import { Avatar, Box, Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import ObjectiveAnswer from "../components/ObjectiveAnswer"

export const AssessmentResultsStudent = () => {
    const { idx, reg_num} = useParams()

    const user = useUser() 

    const { data } = useQuery({
		queryKey: ["getResult", idx],
		queryFn: () => http.get(`assessments/${idx}/student_result/${reg_num}`),
		enabled: !user.isLoading && user.is_instructor,
	});

    const { data: stats } = useQuery({
		queryKey: ["getResultsStats", idx],
		queryFn: () => http.get(`assessments/${idx}/result_stats/${reg_num}`),
		enabled: !user.isLoading && user.is_instructor,
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

    function getColor(value: any) {
        if (value <= 50) {
            return `rgba(255, ${Math.ceil((value/50)*255)}, 0)`
        } else {
            return `rgba(${Math.ceil((1-(value-50)/50)*256)}, ${Math.ceil((1-(value-50)/50)*128 + 128)}, 0)`
        }
    }
    

  return (
    <CourseTabs>
        <Box mt={10}>
        <>
					<Text textAlign={"center"} fontSize={"2xl"}>
                        <b>
						{data?.data?.title.toString().toUpperCase()}
                        </b>
					</Text>
					<Flex justifyContent={"space-between"}>
						<Text my={1}>
							{" "}
							<b>DATE:</b> {data?.data?.start_date.split("T")[0]}
						</Text>
                        <Text my={1}>
							<b>ALLOCATED TIME:</b> {data?.data?.duration} MINUTES
						</Text>
					</Flex>
					<Flex justifyContent={"space-between"}>
						
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
                <Flex alignItems={"center"} flexDirection={"column"} my={5}>
                    <Avatar size={"2xl"} src={stats?.data?.photo_url} name={stats?.data?.name} />
                    <Text mt={1}>{stats?.data?.name} ({stats?.data?.reg_num})</Text>
                </Flex>
                <Flex justifyContent={"space-around"}>
                    <Flex flexDir={"column"} alignItems={"center"}>
                        <Text textColor={"blue"}>START DATE/TIME</Text>
                        <Text>{new Date(stats?.data?.start_datetime).toUTCString()}</Text>
                    </Flex>
                    <Flex flexDir={"column"} alignItems={"center"}>
                        <Text textColor={"blue"}>SUBMISSION DATE/TIME</Text>
                        <Text>{new Date(stats?.data?.start_datetime).toUTCString()}</Text>
                    </Flex>

                </Flex>

				<Box fontSize={"xl"} my={15} fontWeight={"black"} display={"flex"} justifyContent={"space-around"} flexWrap={"wrap"}>
                    <Flex columnGap={1}>
                        <Text textColor={"navy"}>
                            Score:
                        </Text>
                        <Text textColor={getColor(data?.data?.total/data?.data?.total_mark*100)}> {data?.data?.total}/{data?.data?.total_mark}</Text>
                    </Flex>
                    <Flex columnGap={1}>
                        <Text textColor={"navy"}>
                            Time:
                        </Text>
                        <Text> {stats?.data?.assessment_time} minutes</Text>
                    </Flex>

				</Box>
            {data?.data?.questions?.map((x: any, i: number) => (
                <ObjectiveAnswer key={i} index={i + 1} {...x} studentAnswer={() => handleAns(x, x?.question_type)} />
            ))}
        </Box>
    </CourseTabs>
  )
}
