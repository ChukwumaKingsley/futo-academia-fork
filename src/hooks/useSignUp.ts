import { useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import http from "../utils/http";

import { useToast } from "@chakra-ui/react";

function useSignUp(openLogin: () => void) {
	// const navigate = useNavigate();
	const toast = useToast();
	return useMutation({
		mutationFn: async ({
			name,
			id,
			title,
			faculty,
			department,
			email,
			password,
			level
		}: {
			name: string;
			id: string;
			title: string | null;
			faculty: string;
			department: string;
			email: string;
			password: string;
			level: number | null
		}) => {
			try {
				const formData = { name, id, title, faculty, department, email, password, level };
				const res = await http.post("/users", formData);
				toast({ title: "Signed Up!!" });
				openLogin()
				return res
			} catch (error: any) {
				if (error?.response){
					toast({
						title: 'Error',
						description: error.response.data.detail,
						status: 'error',
						position: 'top',
						duration: 3000,
						isClosable: true,
					  });
				}
				return error;
			}
		},
	});
}
export default useSignUp;
