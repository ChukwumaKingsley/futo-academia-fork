import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import Home from "./pages/Home";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import StudentHome from "./pages/student/StudentHome";
import UploadCourse from "./pages/lecturer/UploadCourse";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewCourse from "./pages/ViewCourse";
import CourseHeader from "./components/CourseHeader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Assignments from "./pages/Assignments";
import ObjectiveAnswer from "./components/ObjectiveAnswer";
import TakeExam from "./pages/TakeExam";
import ExamResult from "./pages/ExamResult";
import Profile from "./pages/Profile/Instructor";
import Password from "./pages/Profile/Password";
import FirstSemesterCourses from "./pages/lecturer/FirstSemesterCourses";
import SecondSemesterCourses from "./pages/lecturer/SecondSemesterCourses";
import LecturerCourses from "./pages/lecturer/LecturerCourses";
import StudentCourses from "./pages/student/StudentCourses";
import LecturerHome from "./pages/lecturer/LecturerHome";
import StudentProfile from "./layout/StudentProfile";
import ProfileStudent from "./pages/Profile/ProfileStudent";
import LecturerProfile from "./layout/LecturerProfile";
import EditCourse from "./pages/lecturer/EditCourse";
import ViewAssessment from "./pages/ViewAssessment";
import Assessments from "./pages/Assessments";
import AddAssessment from "./pages/AddAssessment";
import CourseStudents from "./pages/CourseStudents";
import CourseInstructors from "./pages/CourseInstructors";
import { AssessmentResults } from "./pages/AssessmentResults";
import { AssessmentResultsStudent } from "./pages/AssessmentResultStudent";

const colors = {
	brand: {
		900: "#232455",
		800: "#353680",
		700: "#4648AA",
		600: "#585AD4",
		500: "#696CFF",
		400: "#8284FF",
		300: "#9B9DFF",
		200: "#B4B5FF",
		100: "#CDCEFF",
		50: "#E1E2FF",
	},
	secondary: {
		900: "#494C55",
		800: "#6D7280",
		700: "#9198AA",
		600: "#B6BED4",
		500: "#DAE4FF",
		400: "#E0E8FF",
		300: "#E6EDFF",
		200: "#ECF1FF",
		100: "#F3F6FF",
		50: "#F8FAFF",
	},
};

const Button = {
	baseStyle: {
		borderRadius: "4px",
		fontWeight: "medium",
	},
	sizes: {
		md: {
			fontSize: "1em",
			width: "110px",
			height: "50px",
		},
	},
	variants: {
		secondary: {
			bgColor: "#fff",
			color: "#000",
			border: "1px solid #B6B3C7",
		},
		link: {
			color: "brand.500",
			textDecoration: "underline",
		},
	},
	defaultProps: {
		size: "md",
	},
};

const FormLabel = {
	baseStyle: {
		color: "#B6B3C7",
	},
};

const components = {
	Button,
	FormLabel,
};

const fonts = {
	heading: `'inter', sans-serif`,
	body: `'inter', sans-serif`,
};

const theme = extendTheme({ colors, components, fonts });

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			<Route index element={<Home />} />

			{/* lecturer routes */}
			<Route path="lecturer/home/*" element={<LecturerHome />} />
			<Route path="lecturer/my-courses" element={<LecturerCourses />}>
				<Route index element={<FirstSemesterCourses />} />
				<Route path="second-semester" element={<SecondSemesterCourses />} />
			</Route>
			<Route path="courses-upload" element={<UploadCourse />} />
			<Route path="edit-course/:id" element={<EditCourse />} />
			<Route path="courses/:id" element={<ViewCourse />} />
			<Route path="courses/:id/assessment" element={<Assessments />} />
			<Route path="courses/:id/assessment/add/:idx" element={<AddAssessment />} />
			<Route path="courses/:id/assessment/:idx" element={<ViewAssessment />} />
			<Route path="courses/:id/assessment/result/:idx" element={<AssessmentResults />} />
			<Route path="courses/:id/assessment/result/:idx/:reg_num" element={<AssessmentResultsStudent />} />
			<Route path="courses/:id/assessments" element={<Assignments />} />
			<Route path="courses/:id/students/*" element={<CourseStudents />} />
			<Route path="courses/:id/instructors/*" element={<CourseInstructors />} />
			<Route path="lecturer-profile" element={<LecturerProfile />}>
				<Route index element={<Profile />} />
			  	<Route path="password" element={<Password />} />
			</Route>

			{/* Student routes */}
			<Route path="student/home/*" element={<StudentHome />} />
			<Route path="student/my-courses" element={<StudentCourses />}>
				<Route index element={<FirstSemesterCourses />} />
				<Route path="second-semester" element={<SecondSemesterCourses />} />
			</Route>
			<Route path="course/header" element={<CourseHeader />} />
			<Route path="exams/:id/:courseId" element={<TakeExam />} />
			<Route path="courses/assessment/:id/:idx/results" element={<ExamResult />} />
			<Route path="course/header/obj" element={<ObjectiveAnswer />} />
			<Route path="student-profile" element={<StudentProfile />}>
				<Route index element={<ProfileStudent />} />
			  	<Route path="password" element={<Password />} />
			</Route>
		</Route>

	)
)

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider theme={theme}>
				<ToastContainer />
				<RouterProvider router={router} />
			</ChakraProvider>
		</QueryClientProvider>
	</StrictMode>
);
