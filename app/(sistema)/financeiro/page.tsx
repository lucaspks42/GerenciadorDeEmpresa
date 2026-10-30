import { exigirPermissao } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FinanceiroPage() {
  const usuario = await exigirPermissao("financeiro.visualizar");

  if (!usuario) {
    redirect("/");
  }

  return <FinanceiroPage />;
}
