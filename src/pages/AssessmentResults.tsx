import { NavLink, useNavigate, useParams } from "react-router-dom"
import CourseTabs from "../layout/CourseTabs"
import { useEffect, useState } from "react"
import Loader from "../components/Loaders"
import { useQuery } from "@tanstack/react-query"
import http from "../utils/http"
import { Avatar, Box, Container, Input, Table, TableContainer, Text, Tbody, Td, Th, Thead, Tr, Flex } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useUser } from "../hooks/useUser"

export const AssessmentResults = () => {
    const { id, idx} = useParams()
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<any>(null)
    const user = useUser() 
    const navigate = useNavigate()
    

    
    useEffect(() => {
        if (user && !user?.is_instructor) {
            navigate(`/courses/assessment/${idx}/${id}/results`)
        }
    }, [user])
    

    const { data: assessmentResultsStats } = useQuery({
		queryKey: ["assessmentResultsStats", idx],
		queryFn: () => http.get(`/assessments/stats/${idx}`, ).then((r) => r.data),
	});

    const { isLoading, refetch } = useQuery({
		queryKey: ["getStudentRestulss", idx],
		queryFn: () => http.get(`/assessments/${idx}/results`, {params: {
            search: search
        }} ).then((r) => r.data),
        onSuccess(data) {
            setResults(data)
        },
	});
    
    const handleSearch = (e: any) => {
        setSearch(e?.target?.value)
    }

    useEffect(() => {
      refetch()
    }, [search])
    
    const header = [
		{
			title: "S/N",
			key: "s/n",
			align: "left",
		},
		{
			title: "",
			key: "name",
			align: "left",
		},
		{
			title: "Name",
			key: "name",
			align: "left",
		},
		{
			title: "Registration number",
			key: "reg. no.",
			align: "left",
		},
		{
			title: "Score (%)",
			key: "score",
			align: "right",
		},
		{
			title: "Start date/time",
			key: "start datetime",
			align: "right",
		},
		{
			title: "Submit date/time",
			key: "submint date/time",
			align: "right",
		},
		{
			title: "Duration",
			key: "maximum",
			align: "right",
		},
	];

    if (isLoading) {
        return (
            <CourseTabs>
                <Loader />
            </CourseTabs>
        )
    }

    function getColor(value: any) {
        if (value <= 50) {
            return `rgba(255, ${Math.ceil((value/50)*255)}, 0)`
        } else {
            return `rgba(${Math.ceil((1-(value-50)/50)*256)}, ${Math.ceil((1-(value-50)/50)*128 + 128)}, 0)`
        }
    }

  return (
    <CourseTabs>
        {user?.is_instructor &&
        <>
            <Flex bgColor={"brand.500"}flexDir={"column"} mx={5} borderRadius={"50px"} p={3} my={10}>
                <Flex  width={"100%"} justifyContent={"space-around"} alignContent={"center"} flexWrap={"wrap"} rowGap={5} columnGap={10} flexDir={"column"}>
                    <Flex columnGap={3} p={1} fontSize={"2xl"} fontWeight={"bold"}>
                        <Text textColor={"white"}>Average Test Time:</Text>
                        <Text textAlign={"center"} textColor={"white"}> {assessmentResultsStats?.avg_time} minutes</Text>
                    </Flex>
                    <Flex columnGap={3} p={1} fontSize={"2xl"} fontWeight={"bold"}>
                        <Text textColor={"white"}>Average Score (%):</Text>
                        <Text textAlign={"center"} textColor={getColor(assessmentResultsStats?.avg_score_percentage)}> {assessmentResultsStats?.avg_score}/{assessmentResultsStats?.total_possible_score} ({assessmentResultsStats?.avg_score_percentage}%)</Text>
                    </Flex>
                    
                </Flex>
                <Flex width={"100%"} justifyContent={"space-around"} flexWrap={"wrap"} rowGap={5} columnGap={10}>
                    <Flex flexDir={"column"}>
                        <Flex columnGap={3} p={1} fontSize={"2xl"} fontWeight={"bold"}>
                            <Text textColor={"white"}>Highest Score:</Text>
                            <Text textAlign={"center"} textColor={getColor(assessmentResultsStats?.highest_score / assessmentResultsStats?.total_possible_score * 100)}> {assessmentResultsStats?.highest_score}/{assessmentResultsStats?.total_possible_score}</Text>
                        </Flex>
                        <Flex columnGap={3} p={1} fontSize={"2xl"} fontWeight={"bold"}>
                            <Text textColor={"white"}>Lowest Score:</Text>
                            <Text textAlign={"center"} textColor={getColor(assessmentResultsStats?.lowest_score / assessmentResultsStats?.total_possible_score * 100)}> {assessmentResultsStats?.lowest_score}/{assessmentResultsStats?.total_possible_score}</Text>
                        </Flex>
                    </Flex>
                    <Flex columnGap={3} p={1} fontSize={"2xl"} fontWeight={"bold"} alignItems={"center"}>
                            <Text textColor={"white"}>No. of students:</Text>
                            <Text textAlign={"center"} textColor={getColor(assessmentResultsStats?.percentage_submissions)}> {assessmentResultsStats?.num_students} ({assessmentResultsStats?.percentage_submissions}%)</Text>
                        </Flex>
                </Flex>
            </Flex>


            <Container width={"100%"} display={"flex"} columnGap={2}>
                <Input bgColor={"white"} placeholder="search by student name or registration number" name="search" value={search} onChange={handleSearch} />
                <Box _hover={{ transform: "scale(1.)", transition: "transform 0.2s ease-in-out" }} onClick={() => refetch()} >
                    <FontAwesomeIcon 
                        cursor={"pointer"} 
                        icon={faSearch} 
                        size="2xl" 
                        color="#585AD4" 
                    />
                </Box>
            </Container>


            <TableContainer mx={"auto"} mt={6} >
                <Table variant={"striped"} overflowX={"scroll"} maxWidth={"100%"}>
                    <Thead bgColor={"brand.800"} textColor={"white"}>
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
                            {results && results?.length > 0 && results?.map((result: any, index: number) =>
                            <Tr key={index}
                                cursor={"pointer"}
                                _hover={{ transform: "scale(0.995)", transition: "transform 0.2s ease-in-out" }}
                                onClick={() => navigate(`/courses/${id}/assessment/result/${idx}/${result?.reg_num}`)}
                            >
                                <Td>{index+1}</Td>
                                <Td maxW={"fit-content"}><Avatar src={result?.photo_url} name={result?.name} size={"md"}/></Td>
                                <Td alignItems={"center"}>
                                    {result?.name}
                                </Td>
                                <Td textAlign={"right"}>{result?.reg_num}</Td>
                                <Td textAlign={"right"}>{result?.total}</Td>
                                <Td textAlign={"right"}>{result?.start_datetime}</Td>
                                <Td textAlign={"right"}>{result?.end_datetime}</Td>
                                <Td textAlign={"right"}>{result?.assessment_time}</Td>
                            </Tr>
                            )}
                    </Tbody>
                </Table>
            </TableContainer>
            {!results || results?.length <=0 && <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"} mt={5}>No Results Found</Text>}
        </>
        }
        {!user?.is_instructor &&
        <>
         <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"} mt={20}>This page is for instructors only. Click <NavLink to={`assessment/${id}/${idx}/results`}>here</NavLink> to view your result.</Text>
        </>
        }
    </CourseTabs>
  )
}
