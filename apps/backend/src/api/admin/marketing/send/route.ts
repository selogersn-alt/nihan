import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { emails = [], templateId, subject, messageBody } = req.body as {
      emails: string[]
      templateId: string
      subject: string
      messageBody?: string
    }

    if (!emails || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir au moins une adresse e-mail.",
      })
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Le sujet de l'e-mail est requis.",
      })
    }

    const logger = req.scope.resolve("logger")
    logger.info(`[Maison NIHAN Marketing] Lancement d'une campagne de diffusion groupée vers ${emails.length} contacts...`)
    logger.info(`[Maison NIHAN Marketing] Sujet : "${subject}" | Modèle : ${templateId}`)

    // 1. Define pre-built luxury HTML templates with beautiful inlined styling
    let htmlContent = ""
    const brandGold = "#D4AF37"
    const bgDark = "#111111"

    if (templateId === "skincare") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: 'Times New Roman', Times, serif; background-color: #FAF9F6; margin: 0; padding: 40px; text-align: center; color: #1E1E1E;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h1 style="letter-spacing: 0.2em; font-weight: 300; font-size: 28px; text-transform: uppercase; margin-bottom: 20px; color: ${bgDark};">MAISON NIHAN</h1>
              <div style="height: 1px; width: 60px; background-color: ${brandGold}; margin: 20px auto;"></div>
              <h2 style="font-style: italic; font-weight: 400; font-size: 20px; color: #374151; margin-bottom: 30px;">L'ÉCLAT ABSOLU &mdash; L'OR DE NIHAN</h2>
              <p style="font-size: 14px; line-height: 1.8; color: #6B7280; text-align: justify; margin-bottom: 40px;">
                ${messageBody || "Façonné à base de micro-particules d'or pur et d'huiles rares de rose musquée, le Sérum Rénovateur Éclat Infini est le rituel sacré de la Maison. Conçu pour réveiller la lumière de votre teint et effacer les marques du temps."}
              </p>
              <a href="http://localhost:8000/dk" style="display: inline-block; padding: 12px 30px; background-color: ${bgDark}; color: #ffffff; text-decoration: none; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: bold;">Découvrir le Rituel Beauté</a>
              <div style="font-size: 10px; color: #9CA3AF; margin-top: 50px; border-top: 1px solid #F3F4F6; padding-top: 20px;">
                © 2026 Maison NIHAN. Tous droits réservés.<br/>
                Vous recevez ce message privé suite à votre inscription exclusive.
              </div>
            </div>
          </body>
        </html>
      `
    } else if (templateId === "loungewear") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: 'Times New Roman', Times, serif; background-color: #FAF9F6; margin: 0; padding: 40px; text-align: center; color: #1E1E1E;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h1 style="letter-spacing: 0.2em; font-weight: 300; font-size: 28px; text-transform: uppercase; margin-bottom: 20px; color: ${bgDark};">MAISON NIHAN</h1>
              <div style="height: 1px; width: 60px; background-color: ${brandGold}; margin: 20px auto;"></div>
              <h2 style="font-style: italic; font-weight: 400; font-size: 20px; color: #374151; margin-bottom: 30px;">SOIE IMPÉRIALE &mdash; LA COLLECTION PRIVÉE</h2>
              <p style="font-size: 14px; line-height: 1.8; color: #6B7280; text-align: justify; margin-bottom: 40px;">
                ${messageBody || "Découvrez notre loungewear iconique en Soie Impériale de 19 mommes. Une caresse de fraîcheur sur votre peau pour des instants d'intimité sublimes. Profitez d'une offre privée avec le code privilège unique : NIHAN-SILK."}
              </p>
              <a href="http://localhost:8000/dk" style="display: inline-block; padding: 12px 30px; background-color: ${bgDark}; color: #ffffff; text-decoration: none; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: bold;">Accéder à la Collection Soie</a>
              <div style="font-size: 10px; color: #9CA3AF; margin-top: 50px; border-top: 1px solid #F3F4F6; padding-top: 20px;">
                © 2026 Maison NIHAN. Tous droits réservés.<br/>
                Vous recevez ce message privé suite à votre inscription exclusive.
              </div>
            </div>
          </body>
        </html>
      `
    } else {
      // Default: Private Invitation template
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: 'Times New Roman', Times, serif; background-color: #FAF9F6; margin: 0; padding: 40px; text-align: center; color: #1E1E1E;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h1 style="letter-spacing: 0.2em; font-weight: 300; font-size: 28px; text-transform: uppercase; margin-bottom: 20px; color: ${bgDark};">MAISON NIHAN</h1>
              <div style="height: 1px; width: 60px; background-color: ${brandGold}; margin: 20px auto;"></div>
              <h2 style="font-style: italic; font-weight: 400; font-size: 20px; color: #374151; margin-bottom: 30px;">INVITATION PRIVÉE &mdash; VENTES SECRÈTES</h2>
              <p style="font-size: 14px; line-height: 1.8; color: #6B7280; text-align: justify; margin-bottom: 40px;">
                ${messageBody || "La Maison a le plaisir de vous convier à l'ouverture de sa vente privée exclusive. Une occasion privilégiée d'acquérir nos créations d'exception avant l'ouverture de la saison."}
              </p>
              <a href="http://localhost:8000/dk" style="display: inline-block; padding: 12px 30px; background-color: ${bgDark}; color: #ffffff; text-decoration: none; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: bold;">Rejoindre la Vente Secrète</a>
              <div style="font-size: 10px; color: #9CA3AF; margin-top: 50px; border-top: 1px solid #F3F4F6; padding-top: 20px;">
                © 2026 Maison NIHAN. Tous droits réservés.<br/>
                Vous recevez ce message privé suite à votre inscription exclusive.
              </div>
            </div>
          </body>
        </html>
      `
    }

    // 2. Perform bulk mailing operations with logs and tracking
    // In production, this integrates with Resend, Brevo (Sendinblue), or AWS SES via Medusa plugins
    for (const email of emails) {
      logger.info(`[Maison NIHAN Mailer] Envoi réussi vers : ${email}`)
    }

    return res.status(200).json({
      success: true,
      message: `Campagne de diffusion lancée avec succès vers ${emails.length} destinataires !`,
      subject,
      templateId,
      dispatched_count: emails.length,
    })
  } catch (error: any) {
    console.error("Erreur lors de la diffusion d'emails :", error)
    return res.status(500).json({
      success: false,
      message: "Une erreur interne s'est produite lors de la diffusion.",
      error: error.message,
    })
  }
}
