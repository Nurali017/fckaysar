import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'phone', 'guests']

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        )
      }
    }

    // Validate guests number
    const guests = parseInt(body.guests)
    if (isNaN(guests) || guests < 1 || guests > 50) {
      return NextResponse.json(
        { success: false, error: 'Invalid number of guests' },
        { status: 400 },
      )
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
      }
    }

    const payload = await getPayload({
      config: configPromise,
    })

    // Create VIP box request
    const vipBoxRequest = await payload.create({
      collection: 'vip-box-requests',
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim().toLowerCase() || '',
        guests: guests,
        matchDate: body.matchDate || null,
        comment: body.comment?.trim() || '',
        status: 'new',
      },
    })

    console.log('[API] VIP box request created:', vipBoxRequest.id)

    return NextResponse.json(
      {
        success: true,
        data: { id: vipBoxRequest.id },
        message: 'VIP box request submitted successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] Error creating VIP box request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit VIP box request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
