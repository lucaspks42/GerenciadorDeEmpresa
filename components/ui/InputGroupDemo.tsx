import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function InputGroupDemo() {
  return (
    <InputGroup className="w-full bg-background border-border ">
      <InputGroupInput
        placeholder="Pesquisar..."
        className="bg-background text-foreground placeholder:text-muted-foreground "
      />

      <InputGroupAddon className="text-muted-foreground ">
        <Search />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end" className="text-muted-foreground" />
    </InputGroup>
  );
}
