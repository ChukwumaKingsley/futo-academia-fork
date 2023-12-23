import { useQuery } from "@tanstack/react-query";
import { Box, Text, Flex, Textarea, FormControl, FormLabel, Button, Heading, UnorderedList, ListItem, Spacer } from "@chakra-ui/react";
import http from "../utils/http";
import { useAddInstructions, useDeleteInstruction, useUpdateInstruction } from "../hooks/useAssessment";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export interface InstructionObject {
	assessment_id: number | null;
	id: number | null;
	instruction: string;
  }

export default function Instructions({idx}: {idx: string | undefined}) {

	//The lines of code below have to do with getting and updating instruction data
	const [instructionsObject, setInstructionsObject] = useState<InstructionObject[]>([]);
	const [instruction, setInstruction] = useState<InstructionObject>({
		assessment_id: null,
		id: null,
		instruction: ""
	})
	const [instructionEdit, setInstructionEdit] = useState(false)
	const [editIndex, setEditIndex] = useState<number>(-1)

	const { data: instructionsData, isLoading: instructionIsLoading, refetch: refetchInstructions } = useQuery({
		queryKey: ["getInstructions", idx],
		queryFn: () => http.get(`/instructions/${idx}`).then((r) => r.data),
	});

	useEffect(() => {
	  setInstructionsObject(instructionsData)
	}, [instructionIsLoading])


	const addInstructionsMutation = useAddInstructions()
	const updateInstruction = useUpdateInstruction()
	const deleteInstruction = useDeleteInstruction()
	

	const handleInstructionUpload = () => {
		const newInstructions = instructionsObject.filter((instruction) => !instruction.id).map((instruction) => instruction.instruction);

		
		addInstructionsMutation.mutate({idx, instructions: newInstructions}, {onSuccess: () => refetchInstructions()})

		const oldInstructions = instructionsObject.filter((instruction) => instruction.id);
		for (let i=0; i<oldInstructions.length; i++){
			updateInstruction.mutate({id: oldInstructions[i].id, instruction: oldInstructions[i].instruction})
		}
		refetchInstructions()
	}

	const handleInstructionDelete: any = (id: number | null, index: number) => {
		if (id) {
			setInstructionsObject(instructionsObject.filter((instruction) => instruction.id !== id));
			deleteInstruction.mutate(id)
		} else {
			const newArray = [...instructionsObject]
			newArray.splice(index, 1)
			setInstructionsObject(newArray)
		}
	}

	const handleInstructionEdit: any = (index: number) => {
		setInstructionEdit(true)
		setEditIndex(index)
		setInstruction(instructionsObject[index])
	}

	const handleInstructionInput = (e: any) => {
		e.preventDefault();
		if (instructionEdit) {

			const newInstructionObject = [...instructionsObject]

			newInstructionObject[editIndex] = {
				...newInstructionObject[editIndex],
				instruction: instruction.instruction,
			};

			setInstructionsObject(newInstructionObject);
			setInstructionEdit(false);
			} else {
				setInstructionsObject((prevList: InstructionObject[]) => [...prevList, {assessment_id: null, id: null, instruction: instruction.instruction}]); 
			}
			setInstruction({
				assessment_id: null,
				id: null,
				instruction: ""
			})
	}
	
	return (
			<Box>
				<Flex my={3} flexDir={"column"}>
						<Heading as={"h4"} size={"md"} my={5}>
							Instructions
						</Heading>
					<Box width={"100%"} bg={"whiteAlpha.900"} p={5}>
						{instructionsObject?.length === 0 ? 
							<Text><i>No instructions.</i></Text>
							: 
							<UnorderedList>
								{instructionsObject?.map((object, index) => <ListItem key={index} my={2} boxShadow={"sm"}>
									<Flex gap={2} alignItems={"start"}>
										<Text>{object.instruction}</Text>
										<Spacer />
										<FontAwesomeIcon color="#B3A3FF" icon={faPencil} onClick={() => handleInstructionEdit(index)} />
										<FontAwesomeIcon color="#EEAEA0" icon={faTrash} onClick={() => handleInstructionDelete(object.id, index)} />
									</Flex>
								</ListItem>)}
								<Button size="sm" colorScheme="blue" minWidth={"min-content"} onClick={handleInstructionUpload}>Save</Button>
							</UnorderedList>
						}
					<Box width="100%" as="form" onSubmit={handleInstructionInput}>
						<FormControl display={"flex"} alignItems={"center"} gap={4}>
							<FormLabel fontWeight="bold" mt={8}>
							</FormLabel>
							<Textarea
								mt={4}
								height={"1rem"}
								placeholder="Type instruction"
								value={instruction.instruction}
								maxLength={300}
								name="instruction"
								onChange={(e: any) => {
									setInstruction((prev: any) => ({...prev, instruction: e.target.value}))
								}}
								sx={{
									width: "100%",
								}}
								bgColor="#fff"
							/>
							<Button size="sm" mt={4} ml={"auto"} type="submit" colorScheme="blue" isDisabled={instruction.instruction === "" ? true : false} minWidth={"min-content"} alignSelf={"end"} variant={"outline"}>{instructionEdit ? "Save Edit" : "Add Instruction"}</Button>
						</FormControl>
					</Box>
					</Box>
				</Flex>
			</Box>
	);
}