import { NextApiRequest, NextApiResponse } from 'next'
import mailgun from 'mailgun-js'

export interface ContactRequest {
  email: string
  message: string
}

export interface ContactResponse {
  message: string
  severity: 'error' | 'success'
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, message } = req.body as ContactRequest
  const DOMAIN = 'mg.angelinabecerra.com'
  const mg = mailgun({ apiKey: process.env.MG_API_KEY, domain: DOMAIN })
  const data = {
    from: email,
    to: 'info@angelinabecerra.com, info@angelinabecerra.com',
    subject: 'Website contact form submission',
    text: message,
  }
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.error(error)
      const response: ContactResponse = {
        message: error.message,
        severity: 'error',
      }
      return res.status(500).json(response)
    }
    const response: ContactResponse = {
      message: 'Email was successfully sent to info@angelinabecerra.com',
      severity: 'success',
    }
    return res.status(200).json(response)
  })
}
