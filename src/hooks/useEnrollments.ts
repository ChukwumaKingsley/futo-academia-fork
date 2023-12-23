import { useMutation } from "@tanstack/react-query";
import http from "../utils/http";

export function useEnrollStudents(courseCreated = false) {
	return useMutation({
		mutationKey: ["useEnrollStudents", courseCreated],
		mutationFn: async ({ file, course_code }: any) => {
			try {
				const formData = new FormData();

				formData.append("course_code", course_code);
				formData.append("file", file);

				await http.post("/students", formData);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useMakeEnrollRequest() {
	return useMutation({
		mutationKey: ["makeEnrollmentRequest"],
		mutationFn: async ({ course_code, reg_num }: any) => {
			try {
				await http.post("/students/enroll_request", {"course_code": course_code, "reg_num": reg_num});
			} catch (error) {
				return error;
			}
		},
	});

}
export function useMakeEnrollRequestInstructor() {
	return useMutation({
		mutationKey: ["makeEnrollmentRequest"],
		mutationFn: async ({ course_code}: any) => {
			try {
				await http.post("/instructors/enroll_request", {"course_code": course_code});
			} catch (error) {
				return error;
			}
		},
	});
}

export function useApproveEnrollment() {
	return useMutation({
		mutationKey: ["approveEnrollment"],
		mutationFn: async ({ course_code, reg_num }: any) => {
			try {
				await http.put(`/students/approve_enrollment/${course_code}/${reg_num}`);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useApproveAllEnrollments() {
	return useMutation({
		mutationKey: ["approveEnrollment"],
		mutationFn: async ({ course_code }: any) => {
			try {
				await http.put(`/students/approve_all_enrollments/${course_code}`);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useDeleteEnrollment() {
	return useMutation({
		mutationKey: ["deleteEnrollment"],
		mutationFn: async ({ course_code, reg_num }: any) => {
			try {
				await http.delete(`/students/${course_code}/${reg_num}`);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useDeleteAllEnrollmentRequests() {
	return useMutation({
		mutationKey: ["deleteAllEnrolmentRequests"],
		mutationFn: async ({ course_code }: any) => {
			try {
				await http.delete(`/students/all/${course_code}`);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useAcceptInstructorRequest() {
	return useMutation({
		mutationKey: ["acceptInstructorRequest"],
		mutationFn: async ({ course_code, id }: any) => {
			try {
				const formData = new FormData
				formData.append("course_code", course_code)
				await http.put(`/instructors/${id}`, formData);
			} catch (error) {
				return error;
			}
		},
	});
}

export function useDeleteInstructorRequest() {
	return useMutation({
		mutationKey: ["deleteAllEnrolmentRequests"],
		mutationFn: async ({ course_code, id }: any) => {
			try {
				await http.delete(`/instructors/${id}/${course_code}`);
			} catch (error) {
				return error;
			}
		},
	});
}