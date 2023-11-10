import { FormEvent, useEffect, useRef, useState } from "react";
import { Flex, Button, Box, Container, Input, FormControl, FormLabel, Text, Center, Avatar, Heading, Textarea, Grid, GridItem, Select } from "@chakra-ui/react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../layout/Sidebar";
import { useUser } from "../../hooks/useUser";
import { EditIcon } from "@chakra-ui/icons";
import { useProfileUpdate, useUploadPhoto } from "../../hooks/useUserProfileUpdate";


export default function Profile() {
	const fileInputRef = useRef(null);
	const [edit, setEdit] = useState(false)
	const [selectImage, setSelectImage] = useState(false)
	const user = useUser();
	const [formData, setFormData] = useState<any>(user);
	const [image, setImage] = useState<File | null>(null)

	useEffect(() => {
		setFormData(user);
	}, [user.isLoading]);

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setFormData((prevData: any) => ({
			...prevData,
			[name]: value,
		}))
	};
	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		setImage(file)
	};

	const uploadPhotoMutation = useUploadPhoto()
	const updateProfileMutation = useProfileUpdate()

	const handleUploadPhotoSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
			uploadPhotoMutation.mutate({
				id: formData.id,
				file: image,
			},{onSuccess: () => {
				setSelectImage(prev=>!prev)

			}}
			)
			if (uploadPhotoMutation.isSuccess) {
				setFormData(uploadPhotoMutation.data)
			}
		} catch (error) {
			console.log(error);
		}
	};
	
	const handleProfileUpdate = async (event: FormEvent) => {
		event.preventDefault();
		try {
			updateProfileMutation.mutate({
				id: formData.id,
				title: formData.title,
				name: formData.name,
				email: formData.email,
				department: formData.department,
				faculty: formData.faculty,
				major: formData.major,
				bio: formData.bio,
			},
			{onSuccess: () => {
				setEdit(prev=>!prev)
			}});
			if (updateProfileMutation.isSuccess) {
				setFormData(updateProfileMutation.data)
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleAvatarClick = () => {
		if (fileInputRef.current) {
			// fileInputRef.current.click();
		}
	};
	return (
		<Box bg={"#F3F6FF"}>
			<Navbar bgColor="#F3F6FF" />
			<Flex gap={"2vw"} paddingTop={"110px"}>
				<Sidebar />
				<Box my={8} w="100%" sx={{ marginRight: "50px" }}>
					<Container maxW={"73vw"}>
						<Grid templateColumns="1fr 1fr 1fr">
							<GridItem textAlign="center" gridColumnStart={2} colSpan={1}>
								<Heading as="h1" size="lg" sx={{ color: "#585AD4", margin: "1rem 0" }}>
								My Profile
								</Heading>
							</GridItem>
							<GridItem textAlign={'end'}>
								<Button 
								 	width="6rem" 
									size="sm"
									color={edit ? "#FA7070" : "#585AD4"}
									sx={{margin: "1rem 0" }} onClick={() => {setEdit(prev=>!prev);setSelectImage(false);setFormData(user)}}
								>
								{edit ? "Cancel Edit" : "Edit Profile"}
								</Button>
							</GridItem>
						</Grid>
							<Box mt={"20px"}>
								<Center>
									<Flex justifyContent="center" alignItems="center" flexDir={'column'}>
										<Box alignItems={"center"} textAlign="center">
										<Flex position="relative" mb={"20px"}>
											<Avatar
												size="xl"
												src={formData.photo_url}
												sx={{ cursor: "pointer" }}
												onClick={handleAvatarClick}

											/>
											<EditIcon 
												position="absolute"
												bottom="0"
												right="0"
												bgColor="#696CFF"
												p="1"
												borderRadius="50%"
												cursor="pointer" color="white" boxSize={6} 
												display={edit ? "block" : "none"}
												onClick={() => {setSelectImage(prev=>!prev)}}
											/>
										</Flex>
											
										</Box>
										{selectImage && <form onSubmit={ handleUploadPhotoSubmit}>
										<Flex alignItems={"center"}>
											<Input 
												ref={fileInputRef}  
												type="file" 
												accept="image/*" 
												onChange={handleFileChange} 
												size={'sm'} mr={"10px"}
											/>
											<Button 
												type="submit"
												colorScheme="blue"
												height={'2rem'}
												isLoading={uploadPhotoMutation.isLoading}
												isDisabled={image ? false : true}
											>
												Upload
											</Button>
										</Flex>
										</form>}
									</Flex>
								</Center>
								<form onSubmit={handleProfileUpdate}>
								<Flex justifyContent="center" alignItems="start" height="100vh">
									<div style={{ width: "70%" }}>
										<FormControl>
											<Flex width="100%" mt="8">
												<FormLabel width="50%" pl={"10px"}>
													Title
												</FormLabel>
												<FormLabel width="50%" pl={"10px"}>
													First Name
												</FormLabel>
											</Flex>
											<Flex width="100%" mb="8">
												{!edit ? 
												<Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.title}
												</Text>
												:
												<Input
													width="50%"
													mr="2"
													placeholder={formData.title}
													name="title"
													value={formData.title}
													onChange={handleChange}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												/>}
												{!edit ? 
												<Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.name}
												</Text>
												:
												<Input
													width="50%"
													ml="2"
													placeholder={formData.name}
													name="name"
													value={formData.name}
													onChange={handleChange}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												/>
											}
											</Flex>

											<Flex width="100%" mt="8">
												<FormLabel width="50%" pl={"10px"}>
													Faculty
												</FormLabel>
												<FormLabel width="50%" pl={"10px"}>
													Department
												</FormLabel>
											</Flex>
											<Flex width="100%" mb="8" justifyContent={"space-between"}>
											{!edit ? 
												<Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.faculty}
												</Text>
												:
												<Select width="48%" name="faculty" required onChange={handleChange} defaultValue={formData.faculty} >
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
												}
												{!edit ? 
												<Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.department}
												</Text>
												:
												!formData.faculty ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
													</Select>
												:
												formData.faculty === "SAAT" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="AGE">AGE - Agricultural Extension</option>
														<option value="AGR">AGR - Agricultural Economics</option>
														<option value="AST">AST - Animal Science and Technology</option>
														<option value="CST">CST - Crop Science and Technology</option>
														<option value="FAT">FAT - Fisheries and Aquaculture Technology</option>
														<option value="FWT">FWT - Forestry and Wildlife Technology</option>
														<option value="SST">SST - Soil Science and Technology</option>
													</Select>
												:
												formData.faculty === "SBMS" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
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
												:
												formData.faculty === "SEET" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
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
												:
												formData.faculty === "SESET" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="CME">CME - Department of Computer Engineering</option>
														<option value="EPE">EPE - Department of Electrical (Power Systems) Engineering</option>
														<option value="ELE">ELE - Department of Electronics Engineering</option>
														<option value="MCE">MCE - Department of Mechatronics Engineering</option>
														<option value="TCE">TCE - Department of Telecommunications Engineering</option>
														<option value="EEE">EEE - Electrical and Electronic Engineering</option>
													</Select>
												:
												formData.faculty === "SICT" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="CSC">CSC - Computer Science</option>
														<option value="CYB">CYB - Cyber Security</option>
														<option value="IFT">IFT - Information Technology</option>
														<option value="SWE">SWE - Software Engineering</option>
													</Select>
												:
												formData.faculty === "SLIT" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="EIN">EIN - Entrepreneurship and Innovation</option>
														<option value="LTT">LTT - Logistics and Transport Technology</option>
														<option value="MTL">MTL - Maritime Technology and Logistics</option>
														<option value="SCM">SCM - Supply Chain Management</option>
														<option value="PMT">PMT - Project Management Technology</option>
													</Select>
												:
												formData.faculty === "SOBS" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="BCB">BCB - Biochemistry</option>
														<option value="BIO">BIO - Biology</option>
														<option value="BTY">BTY - Biotechnology</option>
														<option value="MCB">MCB - Microbiology</option>
														<option value="FRS">FRS - Forensic Science</option>
													</Select>
												:
												formData.faculty === "SOES" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="ARC">ARC - Architecture</option>
														<option value="BLD">BLD - Building Technology</option>
														<option value="EVM">EVM - Environmental Management</option>
														<option value="QSV">QSV - Quantity Surveying</option>
														<option value="SVG">SVG - Surveying and Geo-Informatics</option>
														<option value="URP">URP - Urban and Regional Planning</option>
													</Select>
												:
												formData.faculty === "SOHT" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="DNT">DNT - Dental Technology</option>
														<option value="EHS">EHS - Environmental Health Science</option>
														<option value="OPT">OPT - Optometry</option>
														<option value="POT">POT - Prosthetics and Orthotics</option>
														<option value="PHT">PHT - Public Health Technology</option>
													</Select>
												:
												formData.faculty === "SOPS" ?
													<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
														<option value="CHM">CHM - Chemistry</option>
														<option value="GEO">GEO - Geology</option>
														<option value="MTH">MTH - Mathematics</option>
														<option value="PHY">PHY - Physics</option>
														<option value="SLT">SLT - Science Laboratory Technology</option>
														<option value="STA">STA - Statistics</option>
													</Select>
												:
												formData.faculty === "SPGS" ?
													<Input type="text" name="department" value="PGS" disabled/>
												:
												<Select name="department" width={"48%"} defaultValue={formData.department} required onChange={handleChange}>
												</Select>
												}
											</Flex>
											
											<Flex width="100%" mt="8">
												<FormLabel width="50%" pl={"10px"}>
													Major
												</FormLabel>
												{!formData.is_instructor && <FormLabel width="50%" pl={"10px"}>
													Registration Number
												</FormLabel>}
											</Flex>
											<Flex width="100%" mb="8">
											{!edit ? 
												<Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.major ? formData.major : "Not choosen"}
												</Text>
												:
												<Select name="major" width={"50%"} placeholder="SELECT MAJOR" required onChange={handleChange} defaultValue={formData.major}>
													<option value="AAA">AAA - First Option</option>
													<option value="BBB">BBB - Second Option</option>
													<option value="CCC">CCC - Third Option</option>
													<option value="DDD">DDD - Fourth Option</option>
												</Select>
												}
												{!edit ? 
												!formData.is_instructor && <Text
													width="50%"
													mr="2"
													fontSize={'1.2rem'}
													p={2}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												>
													{formData.id ? formData.id : "Not choosen"}
												</Text>
												: !formData.is_instructor &&
												<Input
													width="50%"
													mr="2"
													placeholder="Department option"
													name="id"
													value={formData.id ? formData.id : ""}
													onChange={handleChange}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "3rem" }}
												/>
												}
											</Flex>
											<Flex width="100%" mt="8">
												<FormLabel width="50%">Bio </FormLabel>
											</Flex>
											<Flex width="100%" mb="8">
											{!edit ? 
												<Text
													width="100%"
													p={4}
													mr="2"
													minH={100}
													fontSize={'1.2rem'}
													bg="gray.200"
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "10rem" }}
												>
													{formData.bio ? formData.bio : <i>No bio</i>}
												</Text>
												:
												<Textarea
													width="100%"
													mr="2"
													placeholder="I am a  professor in Computer Science. Born  on  May 2nd 1972. I acquired My Bachelor Degree at the Federal University Technology Owerri, Imo in the year 1994.  "
													name="bio"
													value={formData.bio ? formData.bio : ""}
													onChange={handleChange}
													sx={{ boxShadow: "0px 5px 28.5px 1.5px #9598C833", borderRadius: 0, height: "10rem" }}
												/>
												}
											</Flex>
										</FormControl>

										{edit && 
											<Button 
												width="20%" 
												mt="2" 
												colorScheme="blue" 
												bgColor="#696CFF" 
												type="submit" 
												isLoading={updateProfileMutation.isLoading}
											>
											Update
										</Button>}
									</div>
								</Flex>
							</form>
							</Box>
					</Container>
				</Box>
			</Flex>
		</Box>
	);
}
