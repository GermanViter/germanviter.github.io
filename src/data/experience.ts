import type { SpriteName } from '../pixel/sprites'

export interface Job {
  id: string
  role: string
  company: string
  period: string
  current: boolean
  sprite: SpriteName
  duties: string[]
}

/** Paid work only, most recent first. */
export const jobs: Job[] = [
  {
    id: 'titan',
    role: 'Private security guard',
    company: 'Sécurité TITAN',
    period: 'Present',
    current: true,
    sprite: 'shield',
    duties: [
      'Monitor private premises',
      'Prevent shoplifting',
      'Provide customer service on site',
      'Make sure safety rules are followed on private property',
    ],
  },
  {
    id: 'tutorat',
    role: 'Online math tutor',
    company: 'Tutorat Expert',
    period: 'Present',
    current: true,
    sprite: 'pi',
    duties: [
      'Help elementary and high school students succeed in their math classes',
      'Work remotely, on a schedule I manage myself',
    ],
  },
  {
    id: 'tims',
    role: 'Customer service',
    company: 'Tim Hortons',
    period: 'Oct 2022 – May 2023',
    current: false,
    sprite: 'coffee',
    duties: [
      'Prepared and served food to customers',
      'Cleaned the equipment used to prepare drinks and food',
      'Baked food items in the oven',
      'Swept and handled other cleaning tasks',
    ],
  },
]
