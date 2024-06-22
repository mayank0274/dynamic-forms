import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { z } from "zod";
import useFormValidation from "../hooks/useFormValidation";
import { ModalComponent } from "./utlis/ModalComponent";
import PreviewForm from "./utlis/PreviewForm";
import { useEffect, useState } from "react";

const Level2 = () => {
  // form validation and schema
  const validationSchema = z
    .object({
      name: z.string().min(3),
      email: z.string().email(),
      phone: z.coerce.number().superRefine((phone, ctx) => {
        if (phone.toString().length !== 10) {
          ctx.addIssue({
            message: "phone number must of 10 digits",
            code: z.ZodIssueCode.custom,
          });
        }
      }),
      position: z.string().superRefine((position, ctx) => {
        if (position === "") {
          ctx.addIssue({
            message: "please Select preferred role",
            code: z.ZodIssueCode.custom,
          });
        }
      }),
      experience: z.number().optional(),
      managerial_exp: z.number().optional(),
      skills: z.string(),
      interview_slot: z.coerce.date(),
      portfolio_url: z
        .string()
        .optional()
        .superRefine((url, ctx) => {
          const pattern =
            /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

          if (!pattern.test(url!) && url != "") {
            ctx.addIssue({
              message: "invalid url",
              code: z.ZodIssueCode.custom,
            });
          }
        }),
    })
    .superRefine((ip, ctx) => {
      if (
        (ip.position === "designer" || ip.position === "developer") &&
        (!ip.experience || ip.experience <= 0)
      ) {
        ctx.addIssue({
          message: "experience is required ( greater than 0 )",
          path: ["experience"],
          code: z.ZodIssueCode.custom,
        });
      }

      if (ip.position === "designer" && ip.portfolio_url === "") {
        ctx.addIssue({
          message: "portfolio url is required",
          path: ["portfolio_url"],
          code: z.ZodIssueCode.custom,
        });
      }

      if (ip.position === "manager" && !ip.managerial_exp) {
        ctx.addIssue({
          message: "managerial experience is required",
          path: ["maangerial_experience"],
          code: z.ZodIssueCode.custom,
        });
      }
    });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: 0,
    managerial_exp: 0,
    skills: "",
    interview_slot: new Date().toISOString(),
    portfolio_url: "",
  };
  const { formData, errors, handleInputChange, handleSubmit, setFormData } =
    useFormValidation({ initialValues, validationSchema });

  // reset developer specific fields
  const resetDeveloperSpecificFields = async () => {
    setFormData({
      ...formData,
      experience: 0,
      managerial_exp: 0,
      skills: "",
      interview_slot: "",
      portfolio_url: "",
    });
  };

  useEffect(() => {
    resetDeveloperSpecificFields();
  }, [formData.position]);

  // handle  skills
  const SKILLS = [
    {
      title: "HTML",
      value: "html",
    },
    {
      title: "CSS",
      value: "css",
    },
    {
      title: "JavaScript",
      value: "javascript",
    },
    {
      title: "ReactJs",
      value: "reactjs",
    },
  ];

  const [skills, setSkills] = useState<string[]>([]);
  const [skillsError, setSkillsError] = useState(false);

  const handleSkills = (skill: string) => {
    const isAlreadyAdded = skills.includes(skill);

    if (isAlreadyAdded) {
      const filterData = skills.filter((elem) => {
        return elem != skill;
      });
      setSkills(filterData);
      return;
    }
    setSkillsError(false);
    setSkills([...skills, skill]);
  };

  // submit form and preview
  const {
    isOpen: isPreviewOpen,
    onOpen: openPreviewModal,
    onClose: closePreviewModal,
  } = useDisclosure();
  const onSubmit = (_data: any) => {
    if (skills.length === 0) {
      setSkillsError(true);
      return;
    }
    openPreviewModal();
  };

  return (
    <Box
      width="100vw"
      minH={"100vh"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={"25px"}
      overflow={"auto"}
    >
      <Heading
        fontFamily={"'Poppins', sans-serif"}
        textTransform={"capitalize"}
        textAlign={"center"}
      >
        Registration - Level 2
      </Heading>
      <form
        style={{
          width: "30%",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <FormLabel>Full Name</FormLabel>
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
          <FormLabel>Phone Number</FormLabel>
          <Input
            as="input"
            type="number"
            id="phone"
            name="phone"
            border={"1px solid"}
            value={formData.phone}
            onChange={handleInputChange}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Applying for position</FormLabel>

          <Select
            name="position"
            onChange={async (e) => {
              handleInputChange(e);
            }}
          >
            <option value={""}>Select preferred role</option>
            <option value={"developer"}>Developer</option>
            <option value={"designer"}>Designer</option>
            <option value={"manager"}>Manager</option>
          </Select>
        </Box>

        {(formData.position === "designer" ||
          formData.position === "developer") && (
          <Box my={"15px"}>
            <FormLabel>Experience</FormLabel>
            <Input
              as="input"
              type="number"
              id="experience"
              name="experience"
              border={"1px solid"}
              value={formData.experience}
              onChange={handleInputChange}
            />
          </Box>
        )}

        {formData.position === "designer" && (
          <Box my={"15px"}>
            <FormLabel>Portfolio url</FormLabel>
            <Input
              as="input"
              type="text"
              id="portfolio_url"
              name="portfolio_url"
              border={"1px solid"}
              value={formData.portfolio_url}
              onChange={handleInputChange}
            />
          </Box>
        )}

        {formData.position === "manager" && (
          <Box my={"15px"}>
            <FormLabel>Managerial Experience</FormLabel>
            <Input
              as="input"
              type="number"
              id="managerial_exp"
              name="managerial_exp"
              border={"1px solid"}
              value={formData.managerial_exp}
              onChange={handleInputChange}
            />
          </Box>
        )}

        <Box my={"15px"}>
          <FormLabel>Preferred interview time and date</FormLabel>
          <Input
            as="input"
            type="datetime-local"
            id="interview_slot"
            name="interview_slot"
            border={"1px solid"}
            value={formData.interview_slot}
            onChange={handleInputChange}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Select skills</FormLabel>
          <CheckboxGroup colorScheme="blue">
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              {SKILLS.map((skill) => {
                return (
                  <Checkbox
                    value={skill.value}
                    onChange={() => {
                      handleSkills(skill.value);
                    }}
                    isChecked={skills.includes(skill.value)}
                  >
                    {skill.title}
                  </Checkbox>
                );
              })}
            </Stack>
          </CheckboxGroup>
        </Box>

        <Box
          bg={"#FF7377"}
          padding={3}
          color={"#fff"}
          borderRadius={5}
          display={errors.issues.length > 0 || skillsError ? "block" : "none"}
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

            {skillsError && (
              <ListItem display={"flex"} gap={"5px"}>
                <Text fontWeight={"bold"}>skill</Text> : select at least one
                skill
              </ListItem>
            )}
          </List>
        </Box>

        <Box>
          <Button colorScheme="blue" my={"20px"} width={"100%"} type="submit">
            Submit
          </Button>
        </Box>
      </form>

      <ModalComponent onClose={closePreviewModal} isOpen={isPreviewOpen}>
        <PreviewForm data={{ ...formData, skills: skills.join(" , ") }} />
      </ModalComponent>
    </Box>
  );
};

export default Level2;
