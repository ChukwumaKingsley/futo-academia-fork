import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react'
import { useRef } from 'react'
import { handleLogout } from './Navbar'

export const LogoutAlert = ({alertIsOpen, alertOnClose}: {alertIsOpen: boolean, alertOnClose: () => void}) => {
    const cancelRef = useRef(null)
  return (
    <AlertDialog 
    leastDestructiveRef={cancelRef} 
    isOpen={alertIsOpen} 
    onClose={alertOnClose}
    >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader>
                    Logout
                </AlertDialogHeader>
                <AlertDialogBody>
                    Do you want to Logout?
                </AlertDialogBody>
                <AlertDialogFooter gap={2}>
                    <Button ref={cancelRef} onClick={alertOnClose} size={"md"}>
                        Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleLogout} size={"md"}>
                        Logout
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
  )
}
