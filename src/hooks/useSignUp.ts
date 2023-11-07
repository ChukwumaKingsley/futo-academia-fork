import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import http from "../utils/http";

import { useToast } from "@chakra-ui/react";

function useSignUp() {
	// const navigate = useNavigate();
	const toast = useToast();
	return useMutation({
		mutationFn: async ({
			name,
			id,
			faculty,
			department,
			email,
			password,
		}: {
			name: string;
			id: number | null;
			faculty: string;
			department: string;
			email: string;
			password: string;
		}) => {
			try {
				const formData = { name, id, faculty, department, email, password };

				const res = await http.post("/users", formData);
				console.log(res);
				toast({ title: "Signed Up!!" });
				// navigate("/lecturer/courses");
			} catch (error) {
				return error;
			}
		},
	});
}
export default useSignUp;
