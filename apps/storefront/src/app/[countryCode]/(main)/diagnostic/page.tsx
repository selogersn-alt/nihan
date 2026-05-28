import { listProducts } from "@lib/data/products"
import DiagnosticQuiz from "@modules/diagnostic"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diagnostic Beauté & Rituels | Maison NIHAN (NH)",
  description:
    "Prenez deux minutes pour révéler votre rituel idéal. Un diagnostic sensoriel exclusif conçu pour harmoniser votre épiderme, vos nuits de soie et votre éclat naturel.",
}

export default async function DiagnosticPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  // Retrieve storefront products dynamically to match recommended items
  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 30 },
  }).catch(() => ({ response: { products: [], count: 0 } }))

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-16 px-4 md:px-8 flex items-center justify-center">
      <DiagnosticQuiz products={response.products} countryCode={countryCode} />
    </div>
  )
}
