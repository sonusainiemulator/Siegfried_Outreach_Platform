'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface HeatmapProps {
  title?: string
  subtitle?: string
  densityData?: Array<{ day: string; count?: number; posts?: number }>
}

export const DailyPostDensityHeatmap: React.FC<HeatmapProps> = ({
  title = 'Post Density & Engagement by Day / Time',
  subtitle = 'Optimal times when audience interaction is highest',
  densityData
}) => {
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
  const days = ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday']
  const dayAbbrMap: Record<string, string> = {
    Sunday: 'Sun',
    Saturday: 'Sat',
    Friday: 'Fri',
    Thursday: 'Thu',
    Wednesday: 'Wed',
    Tuesday: 'Tue',
    Monday: 'Mon'
  }

  // Generate density metrics from real data
  const series = days.map((day) => {
    const abbr = dayAbbrMap[day]
    const match = densityData?.find(d => d.day === abbr || d.day === day)
    const dayCount = match ? (match.count ?? match.posts ?? 0) : 0

    return {
      name: day,
      data: hours.map((h, hIdx) => {
        // Distribute real post counts across active hours (e.g. 09:00, 12:00, 15:00, 18:00)
        let val = 0
        if (dayCount > 0) {
          if (hIdx >= 3 && hIdx <= 6) {
            val = Math.round((dayCount / 4) * 10)
          }
        }
        return { x: h, y: val }
      }),
    }
  })

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
      background: 'transparent',
    },
    dataLabels: { enabled: false },
    colors: ['#6366F1'],
    plotOptions: {
      heatmap: {
        radius: 6,
        enableShades: true,
        shadeIntensity: 0.7,
        colorScale: {
          ranges: [
            { from: 0, to: 0, name: 'None', color: '#0F172A' },
            { from: 1, to: 25, name: 'Low', color: '#1E293B' },
            { from: 26, to: 50, name: 'Moderate', color: '#312E81' },
            { from: 51, to: 75, name: 'High', color: '#4F46E5' },
            { from: 76, to: 500, name: 'Peak Interaction', color: '#818CF8' },
          ],
        },
      },
    },
    xaxis: {
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} Published / Interactions`,
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
  }

  return (
    <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground/90">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Chart options={options} series={series} type="heatmap" height={270} width="100%" />
        </div>
      </CardContent>
    </Card>
  )
}

export default DailyPostDensityHeatmap
