import {
  ActionIcon,
  Group,
  Header as MTHeader,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";

const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <MTHeader height={60} p="xs">
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Text>Simple Chart | PYOR | Vijay Pushkin</Text>
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={30}
        >
          {colorScheme === "dark" ? (
            <BsFillSunFill size={16} />
          ) : (
            <BsFillMoonStarsFill size={16} />
          )}
        </ActionIcon>
      </Group>
    </MTHeader>
  );
};

export default Header;
