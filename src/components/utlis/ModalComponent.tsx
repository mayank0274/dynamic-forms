import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  size?: string;
  title?: string;
};

export const ModalComponent: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"md"} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || "Preview"}</ModalHeader>
        <ModalCloseButton size="lg" />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
