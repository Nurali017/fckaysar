import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const body = await request.json()
    const { optionIndex } = body

    if (typeof optionIndex !== 'number' || optionIndex < 0) {
      return NextResponse.json(
        { error: 'Invalid optionIndex' },
        { status: 400 }
      )
    }

    const payload = await getPayload({
      config: configPromise,
    })

    // Get the current poll with all locales
    const poll = await payload.findByID({
      collection: 'polls',
      id,
      locale: 'all',
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    if (poll.status !== 'active') {
      return NextResponse.json(
        { error: 'Poll is not active' },
        { status: 400 }
      )
    }

    // Check if optionIndex is valid
    if (!poll.options || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { error: 'Invalid option index' },
        { status: 400 }
      )
    }

    // Update the vote count for the selected option
    // Note: Keep only necessary fields for Payload 3.x array update
    const updatedOptions = poll.options.map((option, index) => ({
      id: option.id,
      optionText: option.optionText,
      votes: index === optionIndex ? (option.votes || 0) + 1 : (option.votes || 0),
    }))

    // Calculate new total votes
    const newTotalVotes = (poll.totalVotes || 0) + 1

    console.log('[VOTE] Updating poll:', id, 'option:', optionIndex, 'newTotal:', newTotalVotes)

    // Update via direct db access to avoid validation issues with localized fields
    const db = payload.db
    // @ts-expect-error - accessing internal MongoDB connection
    const collection = db.collections['polls']

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          options: updatedOptions,
          totalVotes: newTotalVotes,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    // Fetch updated poll to return
    const updatedPoll = await payload.findByID({
      collection: 'polls',
      id,
    })

    console.log('[VOTE] Poll updated successfully')

    return NextResponse.json({
      success: true,
      poll: updatedPoll,
    })
  } catch (error) {
    console.error('Error voting in poll:', error)
    // Log full error details
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get current poll results
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const payload = await getPayload({
      config: configPromise,
    })

    const poll = await payload.findByID({
      collection: 'polls',
      id,
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ poll })
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
