/**
 * Test SOTA Lineups Script
 * Проверяет, какие игроки возвращает SOTA API
 *
 * Usage: npm run test:sota-lineups
 */

import 'dotenv/config'
import { sotaClient } from '../lib/sota-client'

async function main() {
  console.log('=' .repeat(70))
  console.log('SOTA API - Тест составов')
  console.log('=' .repeat(70))

  const teamId = parseInt(process.env.FC_KAISAR_TEAM_ID || '94', 10)
  const seasonId = parseInt(process.env.SOTA_CURRENT_SEASON_ID || '61', 10)

  console.log(`\n🏆 Команда ID: ${teamId}`)
  console.log(`📅 Сезон ID: ${seasonId}`)

  // Get matches
  const matches = await sotaClient.getTeamMatches(teamId, seasonId)
  console.log(`\n⚽ Матчей Кайсара: ${matches.length}`)

  if (matches.length === 0) {
    console.log('❌ Нет матчей для анализа')
    process.exit(0)
  }

  // Test first 3 matches
  const matchesToTest = matches.slice(0, 3)

  for (const match of matchesToTest) {
    console.log('\n' + '-'.repeat(70))
    console.log(`Матч: ${match.home_team.name} vs ${match.away_team.name}`)
    console.log(`Дата: ${match.date}`)

    try {
      const lineup = await sotaClient.getMatchLineup(match.id)

      if (!lineup) {
        console.log('❌ Нет данных о составе')
        continue
      }

      console.log(`\n🏠 Домашняя команда: ${lineup.home_team?.short_name || 'N/A'}`)
      console.log(`✈️  Гостевая команда: ${lineup.away_team?.short_name || 'N/A'}`)

      const isHome = match.home_team.id === teamId
      const ourLineup = isHome ? lineup.home_team?.lineup : lineup.away_team?.lineup
      const theirLineup = isHome ? lineup.away_team?.lineup : lineup.home_team?.lineup

      console.log(`\n✅ Игроки КАЙСАРА (${ourLineup?.length || 0}):`)
      ourLineup?.forEach((p, idx) => {
        console.log(`   ${(idx + 1).toString().padStart(2)}. #${p.number?.toString().padStart(2, ' ') || '--'} ${p.full_name}`)
      })

      console.log(`\n⚪ Игроки СОПЕРНИКА (${theirLineup?.length || 0}):`)
      theirLineup?.slice(0, 5).forEach((p, idx) => {
        console.log(`   ${(idx + 1).toString().padStart(2)}. #${p.number?.toString().padStart(2, ' ') || '--'} ${p.full_name}`)
      })
      if ((theirLineup?.length || 0) > 5) {
        console.log(`   ... и еще ${(theirLineup?.length || 0) - 5} игроков`)
      }

    } catch (error) {
      console.error(`❌ Ошибка получения состава:`, error)
    }

    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log('\n' + '='.repeat(70))
  console.log('✅ Тест завершен')
  console.log('='.repeat(70))

  process.exit(0)
}

main()
