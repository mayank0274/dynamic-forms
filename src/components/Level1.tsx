import {
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { z } from "zod";
import useFormValidation from "../hooks/useFormValidation";
import { ModalComponent } from "./utlis/ModalComponent";
import PreviewForm from "./utlis/PreviewForm";

const Level1 = () => {
  // validation and form data
  const validationSchema = z
    .object({
      name: z.string().min(3),
      email: z.string().email(),
      age: z.coerce.number().positive().min(1),
      guest_name: z.string().optional(),
      isGuest: z.string(),
    })
    .superRefine((ip, ctx) => {
      if (ip.isGuest === "yes" && ip.guest_name === "") {
        ctx.addIssue({
          message: "Guest name is required",
          path: ["guest_name"],
          code: z.ZodIssueCode.custom,
        });
      }

      return true;
    });
  const initialValues = {
    name: "",
    email: "",
    age: "",
    guest_name: "",
    isGuest: "no",
  };
  const { formData, errors, handleInputChange, handleSubmit } =
    useFormValidation({ initialValues, validationSchema });

  // submit and preview
  const {
    isOpen: isPreviewOpen,
    onOpen: openPreviewModal,
    onClose: closePreviewModal,
  } = useDisclosure();

  const onSubmit = (_data: any) => {
    openPreviewModal();
  };

  return (
    <Box
      width="100vw"
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={"25px"}
    >
      <Heading
        fontFamily={"'Poppins', sans-serif"}
        textTransform={"capitalize"}
        textAlign={"center"}
      >
        Registration
      </Heading>
      <form
        style={{
          width: "30%",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <FormLabel>Name</FormLabel>
          <Input
            as="input"
            type="text"
            id="name"
            name="name"
            border={"1px solid"}
            value={formData.name}
            onChange={handleInputChange}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Email</FormLabel>
          <Input
            as="input"
            type="email"
            id="email"
            name="email"
            border={"1px solid"}
            value={formData.email}
            onChange={handleInputChange}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Age</FormLabel>
          <Input
            as="input"
            type="number"
            id="age"
            name="age"
            border={"1px solid"}
            value={formData.age}
            onChange={handleInputChange}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Are you attending with guest ?</FormLabel>

          <Stack direction="row">
            <Box display={"flex"} gap={"5px"}>
              <input
                type="radio"
                name="isGuest"
                value={"yes"}
                onChange={handleInputChange}
              />
              <Text>Yes</Text>
            </Box>

            <Box display={"flex"} gap={"5px"}>
              <input
                type="radio"
                name="isGuest"
                value={"no"}
                onChange={handleInputChange}
              />
              <Text>No</Text>
            </Box>
          </Stack>
        </Box>

        {formData.isGuest === "yes" && (
          <Box my={"15px"}>
            <FormLabel>Guest name</FormLabel>
            <Input
              as="input"
              type="text"
              id="guest_name"
              name="guest_name"
              border={"1px solid"}
              value={formData.guest_name}
              onChange={handleInputChange}
            />
          </Box>
        )}

        <Box
          bg={"#FF7377"}
          padding={3}
          color={"#fff"}
          borderRadius={5}
          display={
            errors.issues.length > 0 ||
            (formData.isGuest && formData.isGuest === "")
              ? "block"
              : "none"
          }
        >
          <List spacing={3}>
            {errors.issues.map((issue: any, i: number) => {
              return (
                <ListItem
                  display={"flex"}
                  gap={"5px"}
                  key={`${issue.code}-${i}`}
                >
                  <Text fontWeight={"bold"}>{issue?.path}</Text> :{" "}
                  {issue?.message.toLowerCase()}
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box>
          <Button colorScheme="blue" my={"20px"} width={"100%"} type="submit">
            Submit
          </Button>
        </Box>
      </form>

      <ModalComponent onClose={closePreviewModal} isOpen={isPreviewOpen}>
        <PreviewForm data={formData} />
      </ModalComponent>
    </Box>
  );
};

export default Level1;
