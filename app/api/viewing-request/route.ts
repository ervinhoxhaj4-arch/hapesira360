import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type ViewingRequestBody = {
  propertyId?: string;
  propertyTitle?: string;
  fullName?: string;
  phone?: string;
  email?: string | null;
  message?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ViewingRequestBody;

    const propertyId = body.propertyId?.trim();
    const propertyTitle = body.propertyTitle?.trim();
    const fullName = body.fullName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim() || null;
    const message = body.message?.trim() || null;

    if (!propertyId || !propertyTitle || !fullName || !phone) {
      return Response.json(
        { error: 'Të dhënat e kërkuara mungojnë.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    if (!apiKey || !adminEmail) {
      return Response.json(
        { error: 'Konfigurimi i emailit mungon.' },
        { status: 500 }
      );
    }

    const propertyUrl = `https://hapesira360.com/prona/${encodeURIComponent(
      propertyId
    )}`;

    const { data, error } = await resend.emails.send({
      from: `Hapësira360 <${fromEmail}>`,
      to: [adminEmail],
      replyTo: email || undefined,
      subject: `Kërkesë e re për vizitë – ${propertyTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0b1526">
          <h1 style="font-size:24px">Kërkesë e re për vizitë</h1>

          <div style="background:#f5f7fa;padding:20px;border-radius:12px">
            <p><strong>Prona:</strong> ${escapeHtml(propertyTitle)}</p>
            <p><strong>Emri:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Telefoni:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Email:</strong> ${
              email ? escapeHtml(email) : 'Nuk është dhënë'
            }</p>
            <p><strong>Mesazhi:</strong><br>${
              message ? escapeHtml(message) : 'Nuk është dhënë'
            }</p>
          </div>

          <p style="margin-top:20px">
            <a
              href="${propertyUrl}"
              style="display:inline-block;padding:12px 18px;background:#0b1526;color:white;text-decoration:none;border-radius:9px"
            >
              Shiko pronën
            </a>
          </p>

          <p style="color:#667085;font-size:13px">
            ID e pronës: ${escapeHtml(propertyId)}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);

      return Response.json(
        { error: 'Emaili nuk u dërgua.' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error('Viewing request API error:', error);

    return Response.json(
      { error: 'Ndodhi një gabim gjatë dërgimit.' },
      { status: 500 }
    );
  }
}