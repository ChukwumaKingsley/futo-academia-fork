import { useQuery } from "@tanstack/react-query";
import http from "../utils/http";
import { Avatar, Button, Center, Flex, Grid, Input, InputGroup, InputLeftAddon, Select, Text } from "@chakra-ui/react";
import Loader from "../components/Loaders";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useDeleteAllEnrollmentRequests, useDeleteEnrollment } from "../hooks/useEnrollments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface CourseStudent {
  search: string,
  level: any,
}

function Enrolled({id}: any) {

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

  const deleteEnrollmentMutation = useDeleteEnrollment()
  const handleRequestDeny = (index: number) => {
    console.log(index)
    deleteEnrollmentMutation.mutate({course_code: id, reg_num: data[index].reg_num})
    data.splice(index, 1)
  }

  const deleteAllEnrollmentsMutation = useDeleteAllEnrollmentRequests()
  const handleRequestDenyAll = () => {
    deleteAllEnrollmentsMutation.mutate({course_code: id})
    setData([])
  }
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
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
      <Flex alignSelf={"end"} columnGap={2} mb={2}>
        <Button 
          colorScheme="red"
          variant={"outline"}
          maxW={"min-content"} 
          fontSize={{base: "xs", md: "md"}}
          isDisabled={data?.length <=0 ? true : false}
          onClick={handleRequestDenyAll}
        >
          Remove all
        </Button>
      </Flex>
      <Grid templateColumns={"0.5fr 0.5fr 3fr 2fr 1fr 1fr 0.8fr"} border={"none"} fontSize={{base: "xs", md: "md"}} columnGap={1} bgColor={"#343680"}>
        <Text textColor={"white"} border={"none"} py={3} pl={1}>S/N</Text>
        <Text textColor={"white"} border={"none"} py={3} pl={1}></Text>
        <Text textColor={"white"} border={"none"} py={3}>Name</Text>
        <Text textColor={"white"} border={"none"} py={3}>Reg. No.</Text>
        <Text textColor={"white"} border={"none"} py={3}>Dept</Text>
        <Text textColor={"white"} border={"none"} py={3}>Level</Text>
        <Text border={"none"}></Text>
      </Grid>
      {data?.map((student: any, index: number) => 
        <Grid templateColumns={"0.5fr 0.5fr 3fr 2fr 1fr 1fr 0.8fr"} border={"none"} fontSize={{base: "xs", md: "md"}} key={student?.reg_num} minH={"40px"} bg={index%2 === 0 ? "#E0E0E066" : "unset"} alignItems={"center"} justifyContent={"center"} p={{base: 1, md: 3}}>
          <Text py={3} pl={1}>{index+1}</Text>
          <Flex><Avatar src={student?.photo_url} name={student?.name} size={{base: "sm", md: "md"}} /></Flex>
          <Text py={3}>{student?.name}</Text>
          <Text py={3} overflowX={"auto"}>{student?.reg_num}</Text>
          <Text py={3} overflowX={"auto"}>{student?.department}</Text>
          <Text py={3}>{student?.level}</Text>
          <Text py={3} textAlign={"center"} textColor={"red"} cursor={"pointer"}onClick={() => {handleRequestDeny(index)}}>
          <Text display={{base: "flex", lg: "none"}} ><FontAwesomeIcon icon={faTrash}/></Text>
            <Text display={{base: "none", lg: "flex"}} >Remove</Text>
          </Text>

        </Grid>
        )}
    </Flex>
  )
}

export default Enrolled