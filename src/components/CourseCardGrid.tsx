import { CourseCard } from './CourseCard'
import { Button, Flex, Grid } from '@chakra-ui/react'

export const CourseCardGrid = ({data, role}: any) => {
  return (
    <Grid justifyItems={"center"} rowGap={"3rem"} columnGap={"1rem"} templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr", xl: "repeat(4, 1fr)" }}>
        {data?.map((course: any) => (
            <CourseCard key={course?.course_code} course={course} role={role} />
        ))}
        {data?.length === 10 && <Flex my={12}>
						<Button width={{ base: "150px", md: "200px", lg: "400px" }} colorScheme={"brand"} variant={"outline"}>
							View More
						</Button>
				</Flex>}
    </Grid>
  )
}
