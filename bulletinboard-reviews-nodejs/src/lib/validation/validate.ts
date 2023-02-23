import { z } from 'zod'
import IllegalArgumentError from '../error/illegal-argument-error.js'

const ReviewPayload = z.object({
  reviewerEmail: z.string().min(1),
  revieweeEmail: z.string().min(1),
  rating: z.coerce.number().gte(0),
  comment: z.string().min(1)
})

const Review = ReviewPayload.extend({
  id: z.string()
})

const RevieweeEmail = z.string().email()

export type ReviewPayload = z.infer<typeof ReviewPayload>
export type Review = z.infer<typeof Review>
export type RevieweeEmail = z.infer<typeof RevieweeEmail>

export const validateReview = (reviewPayload: unknown) => {
  const result = ReviewPayload.safeParse(reviewPayload)
  if (!result.success) {
    throw new IllegalArgumentError()
  }
  return result.data
}

export const validateRevieweeEmail = (email: unknown): string => {
  const result = RevieweeEmail.safeParse(email)
  if (!result.success) {
    throw new IllegalArgumentError()
  }
  return result.data
}
