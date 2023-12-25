import { Box, Image, Text, Avatar, Tooltip, Flex } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import NoImage from "../assets/images/no-picture.jpg";
import http from "../utils/http";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const CourseCard = ({ course }: any) => {
  const [coordinatorData, setCoordinatorData] = useState<any>([]);

  useQuery({
    queryKey: ["getCoordinators", course?.code_code],
    queryFn: () =>
      http.get(`/instructors/coordinators/${course?.course_code}`).then((r) => r.data),
    onSuccess(data) {
      setCoordinatorData(data[0]);
    },
  });

  return (
    <Box
      maxW={{ base: "150px", md: "250px" }}
      as={NavLink}
      to={`/courses/${course?.course_code}`}
      bg={"white"}
      _hover={{
        transform: "scale(1.01)",
        boxShadow: "xl",
      }}
      transition="transform 0.3s, box-shadow 0.3s"
      display={"flex"}
      flexDir={"column"}
      position="relative" // Added position relative
    >
      <Tooltip label={coordinatorData?.name} hasArrow placement="top" zIndex="tooltip">
        <Flex position="absolute"top={2}
            right={1}
            cursor="pointer"
            flexDir={"column"}
            alignItems={"center"}
        >
            <Avatar
            size={{base: "sm", md: "md", lg: "lg"}}
            name={coordinatorData?.name}
            src={coordinatorData?.photo_url}
            />
            <Text fontSize={{base: "8px", md: "xs"}} textColor={"black"} bg={"blue.50"} px={"0.5"} borderRadius={"12px"}>{coordinatorData?.title} {coordinatorData?.name?.slice(0, coordinatorData?.name?.indexOf(" "))}</Text>

        </Flex>
      </Tooltip>

      <Image
        width={"100%"}
        backgroundSize="cover"
        src={!course?.course_photo_url ? NoImage : course?.course_photo_url}
        alt={course?.title}
        borderBottom={"1px"}
        borderColor={"blue.200"}
      />
      <Box borderRadius={"0 0 0.5rem 0.5rem"} shadow={"lg"} padding={2} height={{ base: "70px", md: "100px" }}>
        <Box mb={2} fontSize={{ base: "10px", md: "md" }}>
          <Text fontWeight={"bold"} color={"brand.500"}>
            {course?.title.toUpperCase().slice(0, 30)}...
          </Text>
          <Text color={"brand.500"}>({course?.course_code})</Text>
        </Box>
      </Box>
    </Box>
  );
};
