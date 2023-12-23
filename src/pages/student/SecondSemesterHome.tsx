import { Box, Text } from "@chakra-ui/react"
import { SearchParams } from "./StudentHome";
import { useQuery } from "@tanstack/react-query";
import http from "../../utils/http";
import { useEffect } from "react";
import Loader from "../../components/Loaders";
import EmptyIcon from "../../assets/images/emptyfile.svg";
import { CourseCardGrid } from "../../components/CourseCardGrid";


export const SecondSemesterHome = ({semester, search, faculty, level, skip, limit}: SearchParams) => {
    const { data, isLoading, refetch } = useQuery(["getCourses"], async () => {
		const response = await http.get('/courses', {
		  params: {
			semester: semester,
			search: search,
			faculty: faculty,
			level: level,
			skip: skip,
			limit: limit,
		  },
		});
	  
		return response.data;
	  },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
    );

    useEffect(() => {
      refetch()
    }, [search, faculty, level])

    if (isLoading) {
      return (
          <Box display={"flex"} mt={10} height="30vh" alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
            <Loader height="50%" />
          </Box>
      )
    }

    if (data?.length <= 0) {
      return (
          <Box display={"flex"} mt={40} alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
            <Box>
              <img
                src={EmptyIcon}
                style={{
                  margin: "0 auto",
                }}
                alt="empty icon"
                height={100}
                width={100}
              />
              <Text fontWeight={"bold"} textAlign={"center"}>
                No Courses
              </Text>
            </Box>
          </Box>
        )
    }

  return (
    <CourseCardGrid data={data} role={'student'} />
  )
}
