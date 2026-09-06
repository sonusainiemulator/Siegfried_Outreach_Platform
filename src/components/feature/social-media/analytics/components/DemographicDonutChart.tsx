'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart } from 'lucide-react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DemographicDonutProps {
  title: string
  labels: string[]
  series: number[]
  colors?: string[]
}

export const DemographicDonutChart: React.FC<DemographicDonutProps> = ({
  title,
  labels,
  series,
  colors = ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B']
}) => {
  const total = (series || []).reduce((a, b) => a + (Number(b) || 0), 0)

  if (!series || series.length === 0 || total === 0) {
    return (
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground/90">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] flex flex-col items-center justify-center text-center p-4">
            <PieChart className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground font-medium">No recorded telemetry data</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1 max-w-[200px]">
              Publish posts or import CSV telemetry to generate demographic breakdown
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels,
    colors,
    legend: {
      position: 'bottom',
      labels: {
        colors: '#94A3B8',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: '#94A3B8',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    stroke: {
      colors: ['rgba(255, 255, 255, 0.05)'],
      width: 2,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  }

  return (
    <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground/90">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] flex items-center justify-center">
          <Chart options={options} series={series} type="donut" height={230} width="100%" />
        </div>
      </CardContent>
    </Card>
  )
}

export default DemographicDonutChart
