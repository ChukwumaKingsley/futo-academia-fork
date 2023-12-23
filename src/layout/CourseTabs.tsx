import { ReactNode, useEffect, useState } from "react";

import http from "../utils/http";
import { Box, Text } from "@chakra-ui/react";
import AdminLayout from "../layout/AdminLayout";
import CourseHeader from "../components/CourseHeader";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface IProps {
	children: ReactNode;
}

export default function CourseTabs({ children }: IProps) {
	const { id } = useParams();
	const user = useUser()
	const tabData = [
		{
			name: "Summary",
			path: `/courses/${id}`,
		},
		{
			name: "Assessments",
			path: `/courses/${id}/assessments`,
		},
		{
			name: "Instructors",
			path: `/courses/${id}/instructors`,
		},
		{
			name: "Students",
			path: `/courses/${id}/students`,
		},
	];

	const location = useLocation();

	const { data } = useQuery({
		queryKey: ["getCourseID", id],
		queryFn: () => http.get(`/courses/${id}`).then((r) => r.data),
	});

	const { data: student_count } = useQuery({
		queryKey: ["getStudentCount", id],
		queryFn: () => http.get(`/students/enrolled/${id}/count`).then((r) => r.data),
	});

	const { data: instructor_count} = useQuery({
		queryKey: ["getInstructorCount", id],
		queryFn: () => http.get(`/instructors/count/${id}`).then((r) => r.data),
	});

	const { data: enrolled, refetch: refetchEnrollmentStatus } = useQuery({
		queryKey: ["getEnrollmentStatus", id],
		queryFn: () => http.get(`/courses/${id}/enrollment_status`).then((r) => r.data),
	});

	const navigate = useNavigate();

	const [active, setActive] = useState<number | null>(null);

	useEffect(() => {
		if (location.pathname.includes("student")) {
			setActive(3);
		} else if (location.pathname.includes("assessment")) {
			setActive(1);
		} else if (location.pathname.includes("instructor")) {
			setActive(2);
		} else {
			setActive(0)
		}
	}, []);

	return (
		<>
			<AdminLayout>
				<CourseHeader {...{ ...data, student_count, instructor_count, user, ...enrolled, refetchEnrollmentStatus }} />
				{enrolled && (enrolled?.is_course_instructor || enrolled?.is_course_coordinator || enrolled?.is_enrolled) ? <Box>
					<Box>
						<Box display="flex" bgColor="#dae4ff" alignItems="center" flexWrap={"wrap"} justifyContent={"space-around"} h={"30px"}>
							{tabData?.map((x, i) => (
								<Box
									onClick={() => {
										setActive(i);

										navigate(x?.path ?? x?.name.toLowerCase());
									}}
									key={i}
									w={"25%"}
									h={"30px"}
									cursor="pointer"
									as={"button"}
									textAlign={"center"}
									sx={{
										...(i === active && { color: "white", bg: "#343680"}),
									}}
									disabled={i === active}
									_selected={{ color: "white", bg: "#343680" }}
									fontSize={{base: "12px", sm: "18px"}}
								>
									{x?.name}
								</Box>
							))}
						</Box>

						{children}
					</Box>
				</Box> : user.is_instructor ?
				<Text fontSize={"2xl"} textAlign={"center"} mt={"20%"} textColor={"#343680"}>YOU ARE NOT AN INSTRUCTOR FOR THIS COURSE</Text> :
				<Text fontSize={"2xl"} textAlign={"center"} mt={"20%"} textColor={"#343680"}>YOU ARE NOT ENROLLED IN THIS COURSE</Text>
				}
			</AdminLayout>
		</>
	);
}
