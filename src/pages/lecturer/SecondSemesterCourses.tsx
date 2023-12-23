import { SimpleGrid, Button, Box, Text, Flex } from '@chakra-ui/react'
import { useFetchCourses } from '../../hooks/useCourses';
import EmptyIcon from "../../assets/images/emptyfile.svg";
import { CourseCard } from '../../components/CourseCard';


export default function SecondSemesterCourses() {
    const courseQuery = useFetchCourses(2);


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
	<>
    <SimpleGrid justifyItems={"center"} rowGap={"1rem"} columnGap={"1.5rem"}minChildWidth='200px' mb={"50px"}>
	{courseQuery?.data?.map((course: any) => (
            <CourseCard course={course} />
        ))}

	</SimpleGrid>
	{courseQuery?.data?.length === 10 && <Flex my={12} justifyContent={"center"}>
							<Button width={{ base: "150px", md: "200px", lg: "400px" }} colorScheme={"brand"} variant={"outline"}>
								View More
							</Button>
						</Flex>}
	</>
  )
}
