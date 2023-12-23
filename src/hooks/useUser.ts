import { useQuery } from "@tanstack/react-query";
import http from "../utils/http";

export const useUser = () => {
	const tokenCheck =  localStorage.getItem("token")
	if (!tokenCheck) {
		window.location.href = "/"
	}
	
	try {
		const { isLoading, data} = useQuery(["user_by_id"], () => http.get("/users"), {
			enabled: true,
			onError: (error: any) => {
				if (error.response.status === 401) {
					localStorage.clear()
					window.location.href = "/"
				}
			},
		});
		
		return { isLoading, ...data?.data };
	}
	catch (error: any) {
		throw error
	}

};
