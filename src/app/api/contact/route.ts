import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, grade_level, message } = body

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !grade_level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if email configuration is available
    const emailConfigured = process.env.SMTP_USER && process.env.SMTP_PASSWORD

    if (emailConfigured) {
      // Create transporter for sending emails
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      // Send email to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || 'info@blossom.edu.mm',
        subject: `New Contact Form Submission - ${first_name} ${last_name}`,
        html: adminEmailContent,
      })

      // Send confirmation email to user
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Thank you for contacting Blossom International School',
        html: userEmailContent,
      })
    } else {
      // Log the submission for now (in production, you'd want to store in database)
      console.log('Contact form submission:', {
        name: `${first_name} ${last_name}`,
        email,
        phone,
        grade_level,
        message,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}