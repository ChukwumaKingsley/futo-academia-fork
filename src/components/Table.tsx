import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex, Text, Input, Select } from "@chakra-ui/react";

import EmptyIcon from "../assets/images/emptyfile.svg";
import Loader from "./Loaders";
import { useEffect, useState } from "react";
import { useAssessment } from "../hooks/useAssessment";

const AppTable = ({ assessments }: any) => {
	const [search, setSearch] = useState<any>("")
	const [currentId, setCurrentId] = useState<any>(null)
	const [tableData, setTableData] = useState<any>(null)

	const { data, isLoading: isTableLoading } = useAssessment(currentId, search);

	useEffect(() => {
		setTableData(data)
		console.log(assessments)
	}, [])
	
	const handleSearch = (e: any) => {
		setSearch(e?.target?.value);
	};


	const onSelectChange = (e: any) => {
		setCurrentId(e?.target?.value)
	}

	const headers = [
		{
			title: "Name",
			key: "name",
			align: "left",
		},
		{
			title: "Reg No",
			key: "reg_num",
			align: "left",
		},
		{
			title: "Total (Score)",
			key: "total",
			align: "right",
		},
	];

	return (
		<Box>
			<Flex alignItems="center" my={8} justifyContent={"space-between"}>
				<Text fontSize="32px" fontWeight="bold">
					Results
				</Text>
				<Input placeholder="Search" ml={3} width="60%" onChange={handleSearch} bgColor="#fff" />
				<Select
					style={{
						padding: 10,
						width: "80%",
						borderRadius: "8px",
						marginLeft: 14,
					}}
					onChange={(e) => onSelectChange(e)}
					defaultValue={assessments[0]?.id ?? ""}
					placeholder="Select Assessment"
					value={currentId}
				>
					{assessments?.map((assessment: any, index: number) => (
						<option value={assessment?.id} key={index}>{assessment?.title}</option>
					))}
				</Select>
			</Flex>
			<TableContainer mx="auto" mt={6}>
				<Table variant="striped">
					<Thead bgColor="brand.800" textColor="white">
						<Tr>
							{headers.map((header: any) => (
								<Th
									key={header?.title}
									sx={{
										color: "#fff",
										textAlign: header?.align,
									}}
								>
									{header.title}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{tableData?.length > 0 &&
							tableData?.map((data: any, index: number) => (
								<Tr key={index}>
									{headers.map(({ key, align }: any) => (
										<Td
											sx={{
												textAlign: align,
											}}
										>
											{data?.[key]}
										</Td>
									))}
								</Tr>
							))}
					</Tbody>
				</Table>
				{isTableLoading && (
					<Box display={"flex"} mt={10} alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
						<Loader height="30%" />
					</Box>
				)}
				{tableData?.length <= 0 && (
					<Box display={"flex"} mt={10} alignItems={"center"} mx="auto" justifyContent={"center"} w="100%" textAlign={"center"}>
						<Box>
							<img
								src={EmptyIcon}
								style={{
									margin: "0 auto",
								}}
								alt="empty icon"
								height={100}
								width={100}
							/>
							<Text fontWeight={"bold"} textAlign={"center"}>
								No data to view here
							</Text>
						</Box>
					</Box>
				)}
			</TableContainer>
		</Box>
	);
};

export default AppTable;
