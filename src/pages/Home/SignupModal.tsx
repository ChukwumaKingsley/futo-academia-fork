import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Text,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Select,
	Input,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import OtherBioModal from "./OtherBioModal";
import useSignUp from "../../hooks/useSignUp";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

export default function SignupModal({ isOpen, openLogin, onClose }:{isOpen: boolean, openLogin: () => void, onClose: () => void}) {
	const { isOpen: otherBioModalIsOpen, onClose: closeOtherBioModal } = useDisclosure();
	const [, setUserMode] = useState<"Student" | "Lecturer">("Student");
	const params = useSearchParams();

	const [validPassword, setValidPassword] = useState(false)
  	const [validMatchPassword, setValidMatchPassword] = useState(false)
	  
	  const [formData, setFormData] = useState<any>({
		  name: "",
		  id: null,
		  title: "Student",
		  level: null,
		  faculty: "",
		  department: "",
		  email: "",
		  role: "student",
		  password: "",
		  confirmPassword: ""
		});
		
	useEffect(() => {
	setValidPassword(password_regex.test(formData.password));
	setValidMatchPassword(formData.password === formData.confirmPassword)
	}, [formData.password, formData.confirmPassword])

	useEffect(() => {
		if (params[0].get("userMode") === "Student") {
			setUserMode("Student");
		} else {
			setUserMode("Lecturer");
		}
	}, []);

	useEffect(() => {
		if (formData?.role === "lecturer") {
			setFormData({ ...formData, id: null, title: "" });

		}
		if (formData?.role === "student") {
			setFormData({ ...formData, title: "Student" });
		}
	}, [formData?.role]);

	const handleSignup = async (event: FormEvent) => {
		event.preventDefault();

		signUpMutation.mutate(formData);
	};

	const signUpMutation = useSignUp(openLogin);

	const handleInputChange = (e: any) => {
		setFormData({
			...formData,
			[e?.target?.name]: e.target.value,
		});
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex p={8} alignItems={"center"} rowGap={"0.5rem"} flexDirection={"column"}>
							<Heading color={"brand.500"}>Sign Up </Heading>
							<Text>Please fill in your details</Text>
							<Flex onSubmit={handleSignup} my={4} alignItems={"center"} rowGap={6} flexDirection={"column"} as="form">
								<FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Role</FormLabel>
									<Select name="role" onChange={handleInputChange} defaultValue="student">
										<option value={"student"}>Student</option>
										<option value={"lecturer"}>Lecturer</option>
									</Select>
								</FormControl>
								{formData?.role === "lecturer" && <FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Title</FormLabel>
									<Input type="text" id="title" name="title" autoComplete='off' onChange={handleInputChange} />
								</FormControl>}
								<FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Full name</FormLabel>
									<Input type="text" id="name" name="name" autoComplete='off' onChange={handleInputChange} />
								</FormControl>


								{formData?.role === "student" && (
									<FormControl isRequired>
										<FormLabel textTransform={"uppercase"}>Registration Number</FormLabel>
										<Input type="text" id="id" name="id" autoComplete='off' onChange={handleInputChange} />
									</FormControl>
								)}

								{formData?.role === "student" && (
									<FormControl isRequired>
										<FormLabel textTransform={"uppercase"}>Level</FormLabel>
										<Select name="level" placeholder="SELECT CURRENT LEVEL" onChange={handleInputChange}>
											<option value={100}>100</option>
											<option value={200}>200</option>
											<option value={300}>300</option>
											<option value={400}>400</option>
											<option value={500}>500</option>
										</Select>
									</FormControl>
								)}

								<FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Faculty</FormLabel>
									<Select name="faculty" placeholder="SELECT SCHOOL/FACULTY" onChange={handleInputChange}>
										<option value="SAAT">SAAT - School of Agriculture And Agricultural Technology</option>
										<option value="SBMS">SBMS - School of Basic Medical Science</option>
										<option value="SEET">SEET - School of Engineering and Engineering Technology</option>
										<option value="SESET">SESET - School of Electrical Systems and Engineering Technology</option>
										<option value="SICT">SICT - School of Information and Communication Technology</option>
										<option value="SLIT">SLIT - School of Logistics and Innovation Technology</option>
										<option value="SOBS">SOBS - School of Biological Science</option>
										<option value="SOES">SOES - School of Environmental Science</option>
										<option value="SOHT">SOHT - School of Health Technology</option>
										<option value="SOPS">SOPS - School of Physical Science</option>
										<option value="SPGS">SPGS - School of Postgraduate Studies</option>
									</Select>
								</FormControl>

								<FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Department</FormLabel>
									{!formData.faculty && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
									</Select>
									)}

									{formData.faculty === "SAAT" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="AGE">AGE - Agricultural Extension</option>
										<option value="AGR">AGR - Agricultural Economics</option>
										<option value="AST">AST - Animal Science and Technology</option>
										<option value="CST">CST - Crop Science and Technology</option>
										<option value="FAT">FAT - Fisheries and Aquaculture Technology</option>
										<option value="FWT">FWT - Forestry and Wildlife Technology</option>
										<option value="SST">SST - Soil Science and Technology</option>
									</Select>
									)}

									{formData.faculty === "SBMS" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="ANA">ANA - Anatomy</option>
										<option value="BCB">BCB - Biochemistry</option>
										<option value="CMM">CMM - Community Health</option>
										<option value="MCB">MCB - Microbiology</option>
										<option value="MLS">MLS - Medical Laboratory Science</option>
										<option value="NUT">NUT - Nutrition and Dietetics</option>
										<option value="NSG">NSG - Nursing Science</option>
										<option value="OPT">OPT - Optometry</option>
										<option value="PAT">PAT - Pathology</option>
										<option value="PHC">PHC - Pharmacy</option>
										<option value="PHM">PHM - Public Health</option>
										<option value="PHY">PHY - Physiology</option>
										<option value="PTX">PTX - Pharmacology and Therapeutics</option>
									</Select>
									)}
									{formData.faculty === "SEET" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="ABE">ABE - Agricultural and Bioresources Engineering</option>
										<option value="BME">BME - Biomedical Engineering</option>
										<option value="CHE">CHE - Chemical Engineering</option>
										<option value="CIE">CIE - Civil Engineering</option>
										<option value="FST">FST - Food Science and Technology</option>
										<option value="MME">MME - Material and Metallurgical Engineering</option>
										<option value="MEC">MEC - Mechanical Engineering</option>
										<option value="PET">PET - Petroleum Engineering</option>
										<option value="PTE">PTE - Polymer and Textile Engineering</option>
									</Select>
									)}
									{formData.faculty === "SESET" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="CME">CME - Department of Computer Engineering</option>
										<option value="EPE">EPE - Department of Electrical (Power Systems) Engineering</option>
										<option value="ELE">ELE - Department of Electronics Engineering</option>
										<option value="MCE">MCE - Department of Mechatronics Engineering</option>
										<option value="TCE">TCE - Department of Telecommunications Engineering</option>
										<option value="EEE">EEE - Electrical and Electronic Engineering</option>
									</Select>
									)}
									{formData.faculty === "SICT" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="CSC">CSC - Computer Science</option>
										<option value="CYB">CYB - Cyber Security</option>
										<option value="IFT">IFT - Information Technology</option>
										<option value="SWE">SWE - Software Engineering</option>
									</Select>
									)}
									{formData.faculty === "SLIT" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="EIN">EIN - Entrepreneurship and Innovation</option>
										<option value="LTT">LTT - Logistics and Transport Technology</option>
										<option value="MTL">MTL - Maritime Technology and Logistics</option>
										<option value="SCM">SCM - Supply Chain Management</option>
										<option value="PMT">PMT - Project Management Technology</option>
									</Select>
									)}
									{formData.faculty === "SOBS" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="BCB">BCB - Biochemistry</option>
										<option value="BIO">BIO - Biology</option>
										<option value="BTY">BTY - Biotechnology</option>
										<option value="MCB">MCB - Microbiology</option>
										<option value="FRS">FRS - Forensic Science</option>
									</Select>
									)}
									{formData.faculty === "SOES" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="ARC">ARC - Architecture</option>
										<option value="BLD">BLD - Building Technology</option>
										<option value="EVM">EVM - Environmental Management</option>
										<option value="QSV">QSV - Quantity Surveying</option>
										<option value="SVG">SVG - Surveying and Geo-Informatics</option>
										<option value="URP">URP - Urban and Regional Planning</option>
									</Select>
									)}
									{formData.faculty === "SOHT" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="DNT">DNT - Dental Technology</option>
										<option value="EHS">EHS - Environmental Health Science</option>
										<option value="OPT">OPT - Optometry</option>
										<option value="POT">POT - Prosthetics and Orthotics</option>
										<option value="PHT">PHT - Public Health Technology</option>
									</Select>
									)}
									{formData.faculty === "SOPS" && (
									<Select name="department" placeholder="SELECT DEPARTMENT" onChange={handleInputChange}>
										<option value="CHM">CHM - Chemistry</option>
										<option value="GEO">GEO - Geology</option>
										<option value="MTH">MTH - Mathematics</option>
										<option value="PHY">PHY - Physics</option>
										<option value="SLT">SLT - Science Laboratory Technology</option>
										<option value="STA">STA - Statistics</option>
									</Select>
									)}
									{formData.faculty === "SPGS" && (
									<Input type="text" name="department" value="PGS" disabled/>
									)}
								</FormControl>

								<FormControl isRequired>
									<FormLabel textTransform={"uppercase"}>Email</FormLabel>
									<Input type="email" id="email" name="email" autoComplete="off" onChange={handleInputChange} />
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Password</FormLabel>
									<PasswordInput 			
										name="password"
										value={formData.password} 
										onChange={handleInputChange}
										backgroundColor={validPassword ? "green.100" : !(validPassword || !formData.password) ? "red.100" : "white"}
									/>
									{formData.password && !validPassword && 
									<Text fontSize={'12px'} color={'blue.900'} p={'5px'}>
										<FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.<br/>
										Must include uppercase and lowercase letters.<br/>
										Must include a number. <br/>
										Must includ special characters: !, @, #, $, %
									</Text>}
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Confirm password</FormLabel>
									<PasswordInput 
										name="confirmPassword" 
										value={formData.confirmPassword} onChange={handleInputChange} backgroundColor={validMatchPassword && formData.confirmPassword ? "green.100" : !(validMatchPassword || !formData.confirmPassword) ? "red.100" : "white"} 
									/>
									{!validMatchPassword && formData.confirmPassword &&
										<Text id='pwdnote' fontSize={'12px'} color={'blue.900'} p={'5px'}>
											<FontAwesomeIcon icon={faInfoCircle} /><br/>Must match previous password
										</Text>
									}
								</FormControl>

								<Button 
									type="submit" 
									colorScheme="brand" 
									isLoading={signUpMutation.isLoading} 
									size={"lg"}
									isDisabled = {!validPassword || !validMatchPassword ? true : false}
								>
									Continue
								</Button>

								<Flex>
									<Text>Already have an account?</Text>
									<Button p={0} variant={"link"} onClick={openLogin}>
										Login
									</Button>
								</Flex>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
			<OtherBioModal isOpen={otherBioModalIsOpen} onClose={closeOtherBioModal} />
		</>
	);
}
