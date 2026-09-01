'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { gatewayFields } from '@/data/plan'
import { PlanGatewayFieldsProps } from '@/types'

const PlanGatewayFields = ({ formData, onChange }: PlanGatewayFieldsProps) => {
  if (formData.plan_type !== 'subscription') return null

  return (
    <>
      {gatewayFields.map(({ id, field, label, placeholder, note }) => (
        <div key={id} className="space-y-2 flex flex-col">
          <Label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </Label>
          <Input
            id={id}
            value={(formData as any)[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="h-10 rounded-[8px] bg-muted/30 border-primary/20 focus-visible:ring-primary/20"
          />
          {note && <p className="text-[10px] text-muted-foreground ml-1">{note}</p>}
        </div>
      ))}
    </>
  )
}

export default PlanGatewayFields
