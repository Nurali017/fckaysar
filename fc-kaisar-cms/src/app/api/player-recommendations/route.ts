import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'playerFullName',
      'birthYear',
      'position',
      'city',
      'playerContact',
      'recommenderName',
      'recommenderRelation',
      'recommenderEmail',
      'comment',
      'consentGiven',
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        )
      }
    }

    // Check consent
    if (!body.consentGiven) {
      return NextResponse.json({ success: false, error: 'Consent is required' }, { status: 400 })
    }

    // Validate birth year
    const birthYear = parseInt(body.birthYear)
    if (isNaN(birthYear) || birthYear < 1990 || birthYear > 2020) {
      return NextResponse.json({ success: false, error: 'Invalid birth year' }, { status: 400 })
    }

    // Validate position
    const validPositions = ['goalkeeper', 'defender', 'midfielder', 'forward']
    if (!validPositions.includes(body.position)) {
      return NextResponse.json({ success: false, error: 'Invalid position' }, { status: 400 })
    }

    // Validate relation
    const validRelations = ['coach', 'agent', 'family', 'fan', 'self']
    if (!validRelations.includes(body.recommenderRelation)) {
      return NextResponse.json({ success: false, error: 'Invalid relation' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.recommenderEmail)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }

    const payload = await getPayload({
      config: configPromise,
    })

    // Create recommendation
    const recommendation = await payload.create({
      collection: 'player-recommendations',
      data: {
        playerFullName: body.playerFullName.trim(),
        birthYear: birthYear,
        position: body.position,
        currentClub: body.currentClub?.trim() || '',
        city: body.city.trim(),
        playerContact: body.playerContact.trim(),
        recommenderName: body.recommenderName.trim(),
        recommenderRelation: body.recommenderRelation,
        recommenderEmail: body.recommenderEmail.trim().toLowerCase(),
        recommenderPhone: body.recommenderPhone?.trim() || '',
        videoUrl: body.videoUrl?.trim() || '',
        comment: body.comment.trim(),
        consentGiven: true,
        status: 'new',
      },
    })

    console.log('[API] Player recommendation created:', recommendation.id)

    return NextResponse.json(
      {
        success: true,
        data: { id: recommendation.id },
        message: 'Recommendation submitted successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] Error creating player recommendation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit recommendation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
