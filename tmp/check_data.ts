import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const count = await prisma.property.count()
  const properties = await prisma.property.findMany({ take: 5 })
  console.log('Total properties:', count)
  console.log('Sample properties:', JSON.stringify(properties, null, 2))
}

check().finally(() => prisma.$disconnect())
