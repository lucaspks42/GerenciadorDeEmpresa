import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function InputGroupDemo() {
  return (
    <InputGroup className="w-full">
      <InputGroupInput placeholder="Pesquisar..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>
  );
}
