// Dependencies
import React, { useRef } from "react";
import { StyleSheet } from "react-native";

// Components
import { AlertDialog, Button } from "native-base";
import MainText from "./MainText";

const AlertModal = ({ isOpen, onClose, onConfirm, title, description, buttonTitle, type }) => {
	const cancelRef = useRef(null);

	return (
		<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
			<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>
					<MainText fontFamily="outfit-bold" fontSize={17} fontWeight="bold">
						{title}
					</MainText>
				</AlertDialog.Header>
				<AlertDialog.Body>{description}</AlertDialog.Body>
				<AlertDialog.Footer>
					<Button.Group space={2}>
						<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
							Cancel
						</Button>
						<Button colorScheme={type} onPress={onConfirm}>
							{buttonTitle}
						</Button>
					</Button.Group>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	);
};

export default AlertModal;

const styles = StyleSheet.create({});
