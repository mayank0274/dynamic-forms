import { List, Box, ListItem, Text } from "@chakra-ui/react";

interface Props {
  data: any;
}

const PreviewForm: React.FC<Props> = ({ data }) => {
  return (
    <Box>
      <List spacing={5}>
        {Object.keys(data).map((key: string) => {
          if (data[key]) {
            return (
              <ListItem key={key} display={"flex"} gap={"10px"}>
                <Text fontWeight={"bold"} fontSize={"20px"}>
                  {" "}
                  {key}
                </Text>{" "}
                : <Text fontSize={"20px"}>{data[key]}</Text>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );
};

export default PreviewForm;
