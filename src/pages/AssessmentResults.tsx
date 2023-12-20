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

    if (!user.is_instructor) {
        navigate(`courses/assessment/${idx}/${id}/results`)
    }

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

  return (
    <CourseTabs>
        {user?.is_instructor &&
        <>
            <Box>
                {assessmentResultsStats?.avg_score}<br/>
                {assessmentResultsStats?.avg_score_percentage}<br/>
                {assessmentResultsStats?.avg_time}<br/>
                {assessmentResultsStats?.highest_score}<br/>
                {assessmentResultsStats?.lowest_score}<br/>
                {assessmentResultsStats?.num_students}<br/>
                {assessmentResultsStats?.num_students_percentage}<br/>

            </Box>
            <Flex>
                <Flex columnGap={3}>
                    <Text>Average Score (%):</Text>
                    <Text textAlign={"center"} fontSize={"2xl"} fontWeight={"bold"} textColor={"blue"}> {assessmentResultsStats?.avg_score} ({assessmentResultsStats?.avg_score_percentage})</Text>
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
                            <Tr key={index}>
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
