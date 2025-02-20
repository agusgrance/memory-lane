export const validateMemory = (req, res, next) => {
  const { name, description, timestamp } = req.body
  if (!name?.trim() || !description?.trim() || !timestamp) {
    return res.status(400).json({
      error: 'Invalid input: All fields must be non-empty strings',
    })
  }
  next()
}
