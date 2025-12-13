import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'phone', 'quantity']

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        )
      }
    }

    // Validate quantity
    const quantity = parseInt(body.quantity)
    if (isNaN(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity (must be 1-10)' },
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

    // Create season pass request
    const seasonPassRequest = await payload.create({
      collection: 'season-pass-requests',
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim().toLowerCase() || '',
        quantity: quantity,
        seatPreference: body.seatPreference?.trim() || '',
        comment: body.comment?.trim() || '',
        status: 'new',
      },
    })

    console.log('[API] Season pass request created:', seasonPassRequest.id)

    return NextResponse.json(
      {
        success: true,
        data: { id: seasonPassRequest.id },
        message: 'Season pass request submitted successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] Error creating season pass request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit season pass request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
