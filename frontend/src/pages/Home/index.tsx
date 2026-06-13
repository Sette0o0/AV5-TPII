import { Card, CardContent } from "@/components/ui/card";
import { listarAcomodacoes } from "@/services/Acomodacoes";
import { listarClientes } from "@/services/Clientes";
import { listarHospedagens } from "@/services/Hospedagens";
import { BedDouble, Hotel, Users } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardCounts = {
  clientes: number;
  hospedagensAtivas: number;
  acomodacoes: number;
};

function Home() {
  const [counts, setCounts] = useState<DashboardCounts>({
    clientes: 0,
    hospedagensAtivas: 0,
    acomodacoes: 0,
  });

  async function carregarResumo() {
    const [clientes, hospedagensAtivas, acomodacoes] = await Promise.all([
      listarClientes(),
      listarHospedagens(true),
      listarAcomodacoes(),
    ]);

    setCounts({
      clientes: clientes?.length ?? 0,
      hospedagensAtivas: hospedagensAtivas.length,
      acomodacoes: acomodacoes.length,
    });
  }

  useEffect(() => {
    carregarResumo();
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      <ResumoCard label="Clientes" value={counts.clientes} icon={<Users />} />
      <ResumoCard label="Hospedagens ativas" value={counts.hospedagensAtivas} icon={<Hotel />} />
      <ResumoCard label="Acomodacoes" value={counts.acomodacoes} icon={<BedDouble />} />
    </div>
  );
}

function ResumoCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="rounded-md bg-muted p-3 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Home;
