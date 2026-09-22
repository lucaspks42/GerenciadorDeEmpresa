import { Search } from "lucide-react";
import * as React from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type InputGroupDemoProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputGroupDemo({ value, onChange }: InputGroupDemoProps) {
  return (
    <InputGroup className="w-full bg-background border-border">
      <InputGroupInput
        value={value}
        onChange={onChange}
        placeholder="Pesquisar..."
        className="
          bg-background
          text-foreground
          placeholder:text-muted-foreground
        "
      />

      <InputGroupAddon className="text-muted-foreground">
        <Search size={17} />
      </InputGroupAddon>
    </InputGroup>
  );
}
