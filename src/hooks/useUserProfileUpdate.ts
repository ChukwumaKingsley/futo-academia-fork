import { useMutation } from "@tanstack/react-query";
import http from "../utils/http";
import { useToast } from "@chakra-ui/react";

export function useUploadPhoto() {
	const toast = useToast()
	return useMutation({
		mutationFn: async ({ id, file }: any) => {
			try {
				const formData = new FormData();
				formData.append('file', file);
				const res = await http.put(`users/${id}/photo`, formData, {
					headers: {
					  'Content-Type': 'multipart/form-data',
					},
				  });
				  toast({
					status: "success",
					description: "Profile photo updated",
					position: "top"
				})
				  return res.data
			} catch (error) {
				toast({
					status: "info",
					description: "Could not update profile photo",
					position: "top"
				})
				return error;
			}
		},
	});
}

export function useProfileUpdate() {
	const toast = useToast()
	return useMutation({
		mutationFn: async ({ id, title, name, email, department, faculty, major, bio, level }: any) => {
			try {
				const res = await http.put(`users/${id}`, {
					title: title,
					name: name,
					email: email,
					department: department,
					faculty: faculty,
					major: major,
					level: level,
					bio: bio,
				});
				  toast({
					status: "success",
					description: "Profile updated",
					position: "top"
				})
				  return res.data
			} catch (error) {
				toast({
					status: "info",
					description: "Could not update profile.",
					position: "top"
				})
				return error;
			}
		},
	});
}

export function usePasswordUpdate() {
	const toast = useToast()
	return useMutation({
		mutationFn: async ({ id, currentPassword, newPassword, confirmPassword, resetPasswordFields }: any) => {
			try {
				const res = await http.put(`users/${id}/password`, {
					old_password: currentPassword,
					new_password: newPassword,
					confirm_password: confirmPassword
				});
				  toast({
					status: "success",
					description: "Password change successful!",
					position: "top"
				})
				resetPasswordFields()
				  return res.data
			} catch (error: any) {
				if (error.response) {
					toast({
						status: "error",
						description: error.response.data.detail,
						position: "top"
					})
				} else {
					toast({
						status: "info",
						description: "Could not update password.",
						position: "top"
					})
				}
				return error;
			}
		},
	});
}