const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

router.get('/', async (_req, res) => {
  const designs = await prisma.design.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(designs)
})

router.post('/', async (req, res) => {
  const { text, svgData } = req.body
  if (!text) return res.status(400).json({ error: 'text is required' })

  const design = await prisma.design.create({ data: { text, svgData } })
  res.status(201).json(design)
})

router.delete('/:id', async (req, res) => {
  await prisma.design.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

module.exports = router
