import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { notificationsService } from '@/lib/services/notifications.service'

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

    // Email content for admin notification
    const adminEmailContent = `
      <h2>New Contact Form Submission - Blossom International School</h2>
      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Grade Level of Interest:</strong> ${grade_level}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <hr>
      <p><em>This message was sent from the contact form on the Blossom International School website.</em></p>
    `

    // Email content for user confirmation
    const userEmailContent = `
      <h2>Thank you for your interest in Blossom International School!</h2>
      <p>Dear ${first_name} ${last_name},</p>
      <p>We have received your information request and will get back to you within 24 hours.</p>
      
      <h3>Your submission details:</h3>
      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Grade Level of Interest:</strong> ${grade_level}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      
      <hr>
      <p>Best regards,<br>
      Blossom International School<br>
      Thatipahtan Street, Myingyan, Myanmar<br>
      Phone: +95 9 45126 2018<br>
      Email: info@blossom.edu.mm</p>
    `

    // Check if email configuration is available
    const emailConfigured = process.env.SMTP_USER && process.env.SMTP_PASSWORD

    if (emailConfigured) {
      // Create transporter for sending emails
      const transporter = nodemailer.createTransport({
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

    // Create notification for admin panel
    try {
      await notificationsService.create({
        title: `New Contact Form Submission from ${first_name} ${last_name}`,
        message: `Contact request from ${first_name} ${last_name} (${email}) for ${grade_level} program. Phone: ${phone}`,
        type: 'contact_form',
        priority: 'normal',
        metadata: {
          contact_name: `${first_name} ${last_name}`,
          contact_email: email,
          contact_phone: phone,
          grade_level: grade_level,
          message: message || '',
          submitted_at: new Date().toISOString()
        }
      })
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError)
      // Don't fail the entire request if notification creation fails
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