import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Maison NIHAN (NH) | Haute Parfumerie, Loungewear & Cosmétiques Fins",
  description:
    "Découvrez l'élégance intemporelle de Maison NIHAN (NH). Une sélection d'exception associant cosmétiques raffinés, loungewear en soie de mûrier et joaillerie minimaliste.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  redirect(`/${params.countryCode}/store`)
}
