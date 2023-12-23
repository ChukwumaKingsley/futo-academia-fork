import { NavLink, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import CourseTabs from "../layout/CourseTabs";
import { Text, Flex, Center, Grid, Input, InputGroup, InputLeftAddon, Select } from "@chakra-ui/react";
import Enrolled, { CourseStudent } from "./Enrolled";
import EnrollmentRequests from "./EnrollmentRequests";
import { useUser } from "../hooks/useUser";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import http from "../utils/http";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loaders";


export default function CourseStudents() {
	const { id } = useParams();
	const { pathname } = useLocation()
	const user = useUser()

	const [filterParams, setFilterParams] = useState<CourseStudent>({search: "", level: ""})
  const [data, setData] = useState<any>([])

  const { isLoading, refetch } = useQuery({
		queryKey: ["getStudents", id],
		queryFn: () => http.get(`/students/enrolled/${id}`, {
      params : {
        search: filterParams.search,
        level: filterParams.level
    }}).then((r) => r.data),
		onError: (err) => console.log("error", err),
    onSuccess: (data) => {
      setData(data);
    },
	});

  const handleChange = (e: any) => {
    setFilterParams({ ...filterParams, [e?.target?.name]: e?.target?.value });
	};
  
  useEffect(() => {
    refetch()
  }, [filterParams])

	if (user?.is_instructor){
		return (
			<CourseTabs>
				<Flex justifyContent={"space-around"} mt={5} fontSize={{base: "sm", md: "md", lg: "lg"}}>
					<Text 
						width={"100%"} 
						textAlign={"center"} 
						bg={!pathname.includes("requests") ? "#343680" : "#DAE4FF"}
						textColor={!pathname.includes("requests") ? "#DAE4FF" : "#343680"}
						as={NavLink} 
						to={`/courses/${id}/students/`}
					>
						Enrolled
					</Text>
					<Text 
						width={"100%"}
						textAlign={"center"}
						bg={pathname.includes("requests") ? "#343680" : "#DAE4FF"}
						textColor={pathname.includes("requests") ? "#DAE4FF" : "#343680"}
						as={NavLink}
						to={`/courses/${id}/students/requests`}
					>
						Requests
					</Text>
				</Flex>
	
					<Outlet />
	
					<Routes>
						<Route path="/" element={<Enrolled id={id} />} />
						<Route path="/requests" element={<EnrollmentRequests id={id} />} />
					</Routes>
			</CourseTabs>
		);
	} else {
		if (isLoading) {
			return <Loader />
		} else {
			return (
				<CourseTabs>
					 <Flex flexDir={"column"}>
					<Center my={5}>
						<InputGroup gridArea={"search"} backgroundColor={"white"} rounded={"md"} maxWidth={{ base: "90%", md: "50%" }}>
						<Input type="text" placeholder="Name or Reg. No." name="search" value={filterParams.search} onChange={handleChange}/>
						<InputLeftAddon backgroundColor={"white"} children={<SearchIcon />} />
						</InputGroup>
						<Select maxW={"120px"} name="level" placeholder="All level" bg={"white"} value={filterParams.level} onChange={handleChange}>
						<option value={100}>100</option>
						<option value={200}>200</option>
						<option value={300}>300</option>
						<option value={400}>400</option>
						<option value={500}>500</option>
						</Select>
					</Center>
					<Grid templateColumns={"0.8fr 3fr 2fr 1fr 1fr"} border={"none"} fontSize={{base: "xs", md: "md"}} columnGap={1} bgColor={"#343680"}>
						<Text textColor={"white"} border={"none"} py={3} pl={1}>S/N</Text>
						<Text textColor={"white"} border={"none"} py={3}>Name</Text>
						<Text textColor={"white"} border={"none"} py={3}>Reg. No.</Text>
						<Text textColor={"white"} border={"none"} py={3}>Dept</Text>
						<Text textColor={"white"} border={"none"} py={3}>Level</Text>
					</Grid>
					{data?.map((student: any, index: number) => 
						<Grid templateColumns={"0.8fr 3fr 2fr 1fr 1fr"} border={"none"} fontSize={{base: "xs", md: "md"}} key={student?.reg_num} minH={"40px"} bg={index%2 === 0 ? "#E0E0E066" : "unset"} alignContent={"center"}>
						<Text py={3} pl={1}>{index+1}</Text>
						<Text py={3} overflowX={"scroll"}>{student?.name}</Text>
						<Text py={3} overflowX={"scroll"}>{student?.reg_num}</Text>
						<Text py={3} overflowX={"scroll"}>{student?.department}</Text>
						<Text py={3} overflowX={"scroll"}>{student?.level}</Text>
						</Grid>
						)}
					</Flex>
				</CourseTabs>
			)
		}
	}

}
