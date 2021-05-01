import { NextApiRequest, NextApiResponse } from 'next'
import mailgun from 'mailgun-js'

export interface ContactRequest {
  email: string
  message: string
  name: string
  organization: string
  phone: string
}

export interface ContactResponse {
  message: string
  severity: 'error' | 'success'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    email,
    message,
    name,
    organization,
    phone,
  } = req.body as ContactRequest
  const DOMAIN = 'mg.angelinabecerra.com'
  const mg = mailgun({ apiKey: process.env.MG_API_KEY, domain: DOMAIN })
  const data = {
    from: email,
    to: 'info@angelinabecerra.com, info@angelinabecerra.com',
    subject: 'Website contact form submission',
    text: `
Name: ${name}\n
Organization: ${organization}\n
Phone: ${phone}\n
Email: ${email}\n
Message:\n
${message}
    `,
  }
  try {
    await mg.messages().send(data)
    const response: ContactResponse = {
      message: 'Email was successfully sent to info@angelinabecerra.com',
      severity: 'success',
    }
    return res.status(200).json(response)
  } catch (e) {
    console.error(e)
    const response: ContactResponse = {
      message: e.message,
      severity: 'error',
    }
    return res.status(500).json(response)
  }
}
