import { Box, Text } from '@chakra-ui/react'
import { useFetchCourses } from '../../hooks/useCourses';
import EmptyIcon from "../../assets/images/emptyfile.svg";
import { CourseCardGrid } from '../../components/CourseCardGrid';


export default function SecondSemesterCourses() {
    const courseQuery = useFetchCourses(1);


	if (courseQuery.data?.length <= 0) {
        return (
            <Box display={"flex"} mt={10} alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
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
    <CourseCardGrid data={courseQuery?.data} role={'lecturer'} />
  )
}
