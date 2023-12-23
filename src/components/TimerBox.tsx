import { Box, Flex, Text } from "@chakra-ui/react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zeroPad } from "react-countdown";

export default function TimerBox({ days, hours, minutes, seconds }: any) {
	return (
		<Box
			sx={{
				border: "0.855px solid #0007FF",
				ml: "auto",
			}}
			borderRadius="8px"
			p={2}
			textColor={"#0007FF"}
			maxW={"300px"}
		>
			<Flex alignItems="center" justifyContent="space-around" minWidth={"min-content"}>
				<Box mr={"6px"}>
					<FontAwesomeIcon icon={faClock} color="#262626" />
				</Box>
				<Box sx={{ border: "0.855px solid #0007FF", p: "4px 6px", borderRadius: "8px" }}>
					{zeroPad(days)}
				</Box>
				<Text mx={"6px"} fontWeight={"extrabold"}>:</Text>
				<Box sx={{ border: "0.855px solid #0007FF", p: "4px 6px", borderRadius: "8px" }} textAlign={"right"}>
					{zeroPad(hours)}
				</Box>
				<Text mx={"6px"} fontWeight={"extrabold"}>:</Text>
				<Box sx={{ border: "0.855px solid #0007FF", p: "4px 6px", borderRadius: "8px" }}>
					{zeroPad(minutes)}
				</Box>
				<Text mx={"6px"} fontWeight={"extrabold"}>:</Text>
				<Box sx={{ border: "0.855px solid #0007FF", p: "4px 6px", borderRadius: "8px" }}>{zeroPad(seconds)}</Box>
			</Flex>
		</Box>
	);
}
