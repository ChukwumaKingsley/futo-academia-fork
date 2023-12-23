import { Heading, Text, Menu, MenuButton, MenuList, MenuItem, Flex, Button, Input, InputGroup, InputLeftAddon, Box, Grid, Container } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FilterIcon, SearchIcon } from "../../components/Icons";
import BackgroundImage from "../../assets/bg-images/students.png";
import StudentDashboardLayout from "../../layout/StudentDashboardLayout";
import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { FirstSemesterHome } from "./FirstSemesterHome";
import { SecondSemesterHome } from "./SecondSemesterHome";
import { useUser } from "../../hooks/useUser";

export interface SearchParams {
	search: string;
	faculty: string | null;
	semester: number
	level: number | string | null;
	skip: number | null;
	limit: number | null;

}
export default function StudentHome() {

	const user = useUser()
	
	const { pathname } = useLocation()
	
	const [searchParams, setSearchParams] = useState<SearchParams>({
		search: "",
		faculty: "",
		semester: 1,
		level: null,
		skip: 0,
		limit:  10,
	})
	
	useEffect(() => {
	  setSearchParams({...searchParams, faculty: user.faculty, level: user.level})
	}, [user.isLoading])

	const handleFacultyChange = (value: string) => {
		setSearchParams({
		  ...searchParams,
		  faculty: value,
		});
	  };
	
	  const handleLevelChange = (value: number | null) => {
		setSearchParams({
		  ...searchParams,
		  level: value,
		});
	  };

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setSearchParams({
		  ...searchParams,
		  [name]: value,
		});
	  };

	return (
		<StudentDashboardLayout>
			<Box backgroundImage={`url(${BackgroundImage})`} >
				<Container maxW={"container.xl"}  maxH={"max-content"} p={{base: 3, md: 5}}>
					<Grid height={"max-content"} rowGap={6}>
						<Box alignSelf={"end"}>
							<Heading textAlign={"center"} color={"brand.500"} fontSize={{base: "1.5rem", md: "3rem"}}>
								Create Assessments with Ease
							</Heading>
							<Text textAlign={"center"} color="white" fontSize={{base: "0.9rem", md: "1.2rem"}}>
								Search for any course and create assessments.
							</Text>
						</Box>

						<Grid
							gridTemplateAreas={{
								base: `
						". search search search ."
						". faculty  . level ."
						
					`,
								sm: `
						"search search search search search search"
						"faculty . . . . level"`,
								md: `
						"faculty search level"
					`,
							}}
							rowGap={4}
							alignSelf={"start"}
							alignItems={"center"}
							justifyContent={"space-around"}
							columnGap={4}
						>
							<Box gridArea={"faculty"}>
								<Menu>
									<MenuButton style={{ width: "100px" }} size={{ base: "sm", sm: "md" }} variant={"outline"} colorScheme={"brand"} color={"white"} as={Button} rightIcon={<ChevronDownIcon />}>
										{searchParams.faculty ? `${searchParams.faculty}` : "All Schools"}
									</MenuButton>
									<MenuList>
										<MenuItem value="" justifyContent={"center"} onClick={() => handleFacultyChange("")}>
											All Faculties
										</MenuItem>
										<MenuItem value="SAAT" justifyContent={"center"} onClick={() => handleFacultyChange("SAAT")}>
											SAAT
										</MenuItem>
										<MenuItem value="SBMS" justifyContent={"center"} onClick={() => handleFacultyChange("SBMS")}>
											SBMS
										</MenuItem>
										<MenuItem value="SEET" justifyContent={"center"} onClick={() => handleFacultyChange("SEET")}>
											SEET
										</MenuItem>
										<MenuItem value="SESET" justifyContent={"center"} onClick={() => handleFacultyChange("SESET")}>
											SESET
										</MenuItem>
										<MenuItem value="SICT" justifyContent={"center"} onClick={() => handleFacultyChange("SICT")}>
											SICT
										</MenuItem>
										<MenuItem value="SLIT" justifyContent={"center"} onClick={() => handleFacultyChange("SLIT")}>
											SLIT
										</MenuItem>
										<MenuItem value="SOBS" justifyContent={"center"} onClick={() => handleFacultyChange("SOBS")}>
											SOBS
										</MenuItem>
										<MenuItem value="SOES" justifyContent={"center"} onClick={() => handleFacultyChange("SOES")}>
											SOES
										</MenuItem>
										<MenuItem value="SOHT" justifyContent={"center"} onClick={() => handleFacultyChange("SOHT")}>
											SOHT
										</MenuItem>
										<MenuItem value="SOPS" justifyContent={"center"} onClick={() => handleFacultyChange("SOPS")}>
											SOPS
										</MenuItem>
										<MenuItem value="SPGS" justifyContent={"center"} onClick={() => handleFacultyChange("SPGS")}>
											SPGS
										</MenuItem>
									</MenuList>
								</Menu>
							</Box>

							<InputGroup gridArea={"search"} backgroundColor={"white"} rounded={"md"} width={{ base: "100%", lg: "300px" }}>
								<InputLeftAddon backgroundColor={"white"} children={<SearchIcon />} />
								<Input type="text" placeholder="Search Courses..."  name="search" value={searchParams.search} onChange={handleChange}/>
							</InputGroup>

							<Box gridArea={"level"}>
								<Menu>
									<MenuButton
										style={{ width: "100px", height: "50px"}}
										size={{ base: "sm", sm: "md" }}
										variant={"outline"}
										color={"white"}
										colorScheme={"brand"}
										as={Button}
										leftIcon={<FilterIcon />}
									>
										{searchParams.level ? `${searchParams.level} Level` : "All Levels"}
									</MenuButton>
									<MenuList>
										<MenuItem justifyContent={"center"} onClick={() => handleLevelChange(null)}>
											All Levels
										</MenuItem>
										<MenuItem value="100" justifyContent={"center"} onClick={() => handleLevelChange(100)}>
											100 Level
										</MenuItem>
										<MenuItem value="200" justifyContent={"center"} onClick={() => handleLevelChange(200)}>
											200 Level
										</MenuItem>
										<MenuItem value="300" justifyContent={"center"} onClick={() => handleLevelChange(300)}>
											300 Level
										</MenuItem>
										<MenuItem value="400" justifyContent={"center"} onClick={() => handleLevelChange(400)}>
											400 Level
										</MenuItem>
										<MenuItem value="500" justifyContent={"center"} onClick={() => handleLevelChange(500)}>
											500 Level
										</MenuItem>
									</MenuList>
								</Menu>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Box my={8}>
				<Container maxW={"container.xl"}>
					<Flex my={8} justifyContent={"center"} textAlign={"center"}>
						<Text width={"200px"} textColor="#232455" opacity={pathname === "/student/home" ? 1 : 0.3} as={NavLink} to="/student/home"  borderBottom={"50px"}>
							Harmattan
						</Text>
						<Text width={"200px"} textColor="#232455" opacity={pathname === "/student/home/rain" ? 1 : 0.3} as={NavLink} to="/student/home/rain">
							Rain
						</Text>
					</Flex>

					<Routes>
						<Route path="/" element={<FirstSemesterHome semester={1} search={searchParams.search} faculty={searchParams.faculty} level={searchParams.level} skip={searchParams.skip} limit={searchParams.limit} />} />

						<Route path="/rain" element={<SecondSemesterHome semester={2} search={searchParams.search} faculty={searchParams.faculty} level={searchParams.level} skip={searchParams.skip} limit={searchParams.limit} />} />
					</Routes>

					<Outlet />
				</Container>
			</Box>
		</StudentDashboardLayout>
	);
}
