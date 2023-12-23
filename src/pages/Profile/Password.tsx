import { Box, Button, FormControl, FormLabel, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { password_regex } from "../Home/SignupModal";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePasswordUpdate } from "../../hooks/useUserProfileUpdate";
import { useUser } from "../../hooks/useUser";
import PasswordInput from "../../components/PasswordInput";

export default function Password() {
  const [passwords, setPasswords] = useState<{currentPassword: string, newPassword: string, confirmPassword: string}>(
    {currentPassword: "",
    newPassword: "",
    confirmPassword: ""}
  )
  const user = useUser()
  

  const [validPassword, setValidPassword] = useState(false)
  const [validMatchPassword, setValidMatchPassword] = useState(false)

  const resetPasswordFields = () => {
    setPasswords({currentPassword: "",
    newPassword: "",
    confirmPassword: ""})
  }

  useEffect(() => {
    setValidPassword(password_regex.test(passwords.newPassword));
    setValidMatchPassword(passwords.newPassword === passwords.confirmPassword)
  }, [passwords.newPassword, passwords.confirmPassword])

  const handleChange = (event: any) => {
    const { name, value} = event.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }

  const updatePasswordMutation = usePasswordUpdate()

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault()
    try {
			updatePasswordMutation.mutate({
				id: user.id,
				currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
        resetPasswordFields: resetPasswordFields
			},
			)
		} catch (error) {
      throw error;
		}
  }

  return (
    <form onSubmit={handleUpdate}>
      <Box mt={"20px"} display={"flex"} flexDir={"column"} alignItems={"center"}>
        <Heading 
          as={"h1"}
          fontSize={"32px"}
          mt={"90px"}
          mb={"135px"}
          textColor={"#585AD4"}
        >
          Change Password
        </Heading>
          <FormControl>
            <FormLabel fontSize={"20px"} fontWeight={"600"} color={"#333"}>Old Password</FormLabel>
            <PasswordInput 
										name="currentPassword" 
										value={passwords.currentPassword} 
                    onChange={handleChange} 
                    backgroundColor={passwords.currentPassword ? "green.100" : "white"}
									/>
             </FormControl>
          <FormControl mt={"3rem"}>
          <FormLabel fontSize={"20px"} fontWeight={"600"} color={"#333"}>
              New Password
          </FormLabel>
          <PasswordInput 
										name="newPassword" 
										value={passwords.newPassword} 
                    onChange={handleChange} 
                    backgroundColor={validPassword ? "green.100" : !(validPassword || !passwords.newPassword) ? "red.100" : "white"}
									/>
            {passwords.newPassword && !validPassword && 
                      <Text fontSize={'12px'} color={'blue.900'} p={'5px'}>
                          <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.<br/>
                          Must include uppercase and lowercase letters.<br/>
                          Must include a number. <br/>
                          Must includ special characters: !, @, #, $, %
                      </Text>}
          </FormControl>
          <FormControl mt={passwords.newPassword && !validPassword ? "1rem" : "3rem"}>
          <FormLabel fontSize={"20px"} fontWeight={"600"} color={"#333"}>
            Confirm Password
          </FormLabel>
          <PasswordInput 
										name="confirmPassword" 
										value={passwords.confirmPassword} 
                    onChange={handleChange} 
                    backgroundColor={validMatchPassword && passwords.confirmPassword ? "green.100" : !(validMatchPassword || !passwords.confirmPassword) ? "red.100" : "white"} 
									/>
           {!validMatchPassword && passwords.confirmPassword &&
                  <Text id='pwdnote' fontSize={'12px'} color={'blue.900'} p={'5px'}>
                    <FontAwesomeIcon icon={faInfoCircle} /><br/>Must match previous password
                  </Text>
              }
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            mt={!validMatchPassword && passwords.confirmPassword ? "1rem" : "3rem"} 
            w={"10.75rem"} 
            height={"3.5rem"}
            isDisabled = {!validPassword || !validMatchPassword || !passwords.currentPassword ? true : false}
            isLoading = {updatePasswordMutation.isLoading}
          >
            Save
          </Button>
      </Box>
    </form>
  )
}
