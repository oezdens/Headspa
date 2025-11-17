import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get booking_id from request
    const { booking_id } = await req.json()
    
    if (!booking_id) {
      throw new Error('booking_id is required')
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      throw new Error('Booking not found')
    }

    // Format date (German format)
    const dateObj = new Date(booking.date)
    const formattedDate = dateObj.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    // Email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
        .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #8B5CF6; min-width: 120px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Buchungsbestätigung</h1>
        </div>
        <div class="content">
            <p>Liebe/r <strong>${booking.name}</strong>,</p>
            <p>vielen Dank für Ihre Buchung! Wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.</p>
            
            <div class="booking-details">
                <h2 style="color: #8B5CF6; margin-top: 0; font-size: 18px;">Ihre Buchungsdetails</h2>
                <div class="detail-row">
                    <span class="detail-label">Behandlung:</span>
                    <span>${booking.service}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Datum:</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Uhrzeit:</span>
                    <span>${booking.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span>${booking.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">E-Mail:</span>
                    <span>${booking.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Telefon:</span>
                    <span>${booking.phone}</span>
                </div>
            </div>
            
            <p><strong>📋 Wichtige Hinweise:</strong></p>
            <ul>
                <li>Bitte erscheinen Sie 10 Minuten vor Ihrem Termin</li>
                <li>Falls Sie den Termin nicht wahrnehmen können, informieren Sie uns bitte mindestens 24 Stunden im Voraus</li>
                <li>Bei Verspätungen kann die Behandlungszeit entsprechend verkürzt werden</li>
            </ul>
            
            <p style="margin-top: 30px;">Wir freuen uns auf Ihren Besuch! 💆‍♀️</p>
            <p>Mit freundlichen Grüßen,<br><strong>Ihr Özdens Head Spa Team</strong></p>
        </div>
        <div class="footer">
            <p>Diese E-Mail wurde automatisch generiert.</p>
            <p>Bei Fragen kontaktieren Sie uns unter <a href="mailto:info@oezdens.com">info@oezdens.com</a></p>
        </div>
    </div>
</body>
</html>
    `

    // Plain text alternative
    const emailText = `
Buchungsbestätigung - Özdens Head Spa

Liebe/r ${booking.name},

vielen Dank für Ihre Buchung! Wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.

Ihre Buchungsdetails:
- Behandlung: ${booking.service}
- Datum: ${formattedDate}
- Uhrzeit: ${booking.time}
- Name: ${booking.name}
- E-Mail: ${booking.email}
- Telefon: ${booking.phone}

Wichtige Hinweise:
- Bitte erscheinen Sie 10 Minuten vor Ihrem Termin
- Falls Sie den Termin nicht wahrnehmen können, informieren Sie uns bitte mindestens 24 Stunden im Voraus
- Bei Verspätungen kann die Behandlungszeit entsprechend verkürzt werden

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen,
Ihr Özdens Head Spa Team

---
Bei Fragen kontaktieren Sie uns unter info@oezdens.com
    `

    // Send email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Özdens Head Spa <noreply@oezdens.com>',
        to: [booking.email],
        bcc: ['info@oezdens.com'], // Owner notification
        subject: 'Buchungsbestätigung - Özdens Head Spa',
        html: emailHtml,
        text: emailText,
      })
    })

    const emailData = await res.json()

    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailData)}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        email_id: emailData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
