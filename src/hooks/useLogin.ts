import { useMutation } from "@tanstack/react-query";
import http from "../utils/http";
import { useToast } from "@chakra-ui/react";

function useLogin() {
	const toast = useToast()
	return useMutation({
		mutationFn: async ({ username, password }: { username: string; password: string }) => {
			try {
				const formData = new FormData();

				formData.append("username", username);
				formData.append("password", password);

				const res = await http.post("/login", formData);

				localStorage.setItem("token", res.data.access_token);

				if (res.data.is_instructor) {
					window.location.href = "/lecturer/home";
				} else {
					window.location.href = "/student/home";
				}

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
				throw error;
			}
		},
	});
}

export default useLogin;
