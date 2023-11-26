import { Box, Image, Text } from "@chakra-ui/react"
import { NavLink } from "react-router-dom"
import NoImage from "../assets/images/no-picture.jpg"

export const CourseCard = ({role, course}: any) => {
  return (
    <Box 
        width={"250px"}
        key={course.course_code} 
        as={NavLink} 
        to={`/${role}/courses/${course.course_code}`} 
        bg={"white"}
        _hover={{
        transform: "scale(1.01)",
        boxShadow: "xl",
        }}
        transition="transform 0.3s, box-shadow 0.3s"
        display={"flex"}
        flexDir={"column"}
    >
        <Image width={"100%"} backgroundSize="cover" src={!course.course_photo_url ? NoImage : course.course_photo_url} alt={course.title} borderBottom={"1px"} borderColor={"blue.200"}/>
        <Box borderRadius={"0 0 0.5rem 0.5rem"} shadow={"lg"} padding={2} height={"150px"}>
            <Box mb={6}>
                <Text fontSize={"md"} fontWeight={"bold"} color={"brand.500"}>
                    {course.title.toUpperCase()}
                </Text>
                <Text color={"brand.500"} fontSize={"sm"}>({course.course_code})</Text>
            </Box>
        </Box>
    </Box>
  )
}
